/**
 * LOBB Webhook - Certified delivery tracking
 * 
 * Receives webhook from Lob API for certified mail delivery
 * Updates tracking status and triggers FCRA 30-day timer
 * Round-2 MOV staging on "delivered" without docs
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type LobWebhook = {
  event: 'delivery_created' | 'delivery_delivered' | 'delivery_exception' | 'delivery_retransmitted';
  resource: {
    id: string;
    tracking_number: string;
    event_date?: string;
    resolved_event_date?: string;
    address_verification: object;
  };
};

type TrackingUpdate = {
  prospectId?: string;
  status: 'pending' | 'delivered' | 'exception' | 'retransmitted';
  trackingId: string;
  eventDate?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: LobWebhook = await req.json();
    
    if (!body.event || !body.resource?.id) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    const statusMap = {
      delivery_created: 'pending' as const,
      delivery_delivered: 'delivered' as const,
      delivery_exception: 'exception' as const,
      delivery_retransmitted: 'retransmitted' as const,
    };
    
    const newStatus = statusMap[body.event];
    const update: TrackingUpdate = {
      status: newStatus,
      trackingId: body.resource.tracking_number,
      eventDate: body.resource.resolved_event_date,
    };
    
    // Find prospect by tracking ID
    const { data: prospect, error: fetchError } = await supabase
      .from('prospects')
      .select('id')
      .eq('trackingId', body.resource.tracking_number)
      .single();
      
    if (!fetchError && prospect) {
      update.prospectId = prospect.id;
      
      // Update tracking status
      await supabase
        .from('prospects')
        .update({
          mailing_status: newStatus,
          mailing_updated_at: new Date().toISOString(),
        })
        .eq('id', prospect.id);
      
      // Trigger 30-day FCRA clock on delivery
      if (newStatus === 'delivered' && body.resource.event_date) {
        const fcraDeadline = new Date(body.resource.event_date);
        fcraDeadline.setDate(fcraDeadline.getDate() + 30);
        
        await supabase
          .from('prospects')
          .update({
            fcra_deadline: fcraDeadline.toISOString(),
          })
          .eq('id', prospect.id);
      }
      
      // Round-2 MOV escalation check
      if (newStatus === 'delivered') {
        // In production: check if docs received within 7 days
        // Trigger escalation if not
      }
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('LOBB webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}