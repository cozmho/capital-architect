const INTAKE_API_URL = "https://capital-architect.vercel.app/api/intake";
const INTAKE_API_KEY_PROPERTY = "INTAKE_API_KEY";

/**
 * Run once in Apps Script editor to set your API key securely.
 */
function setIntakeApiKey() {
  var key = "replace_with_your_production_intake_key";
  PropertiesService.getScriptProperties().setProperty(INTAKE_API_KEY_PROPERTY, key);
}

/**
 * Webhook endpoint handler for external systems (Calendly/Zapier/etc).
 * Deploy as web app and use the deployment URL as webhook target.
 */
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.getDataAsString()) || "{}";
    var inbound = JSON.parse(raw);
    var payload = mapWebhookPayload(inbound);

    var response = sendToIntake(payload);
    var status = response.getResponseCode();
    var body = response.getContentText();

    if (status < 200 || status >= 300) {
      Logger.log("Intake API error: " + status + " body=" + body);
      return ContentService.createTextOutput("Error: Intake API returned " + status).setMimeType(
        ContentService.MimeType.TEXT
      );
    }

    return ContentService.createTextOutput("Success: Data mirrored to production.").setMimeType(
      ContentService.MimeType.TEXT
    );
  } catch (error) {
    Logger.log("Webhook processing error: " + String(error));
    return ContentService.createTextOutput("Connection Failed: " + String(error)).setMimeType(
      ContentService.MimeType.TEXT
    );
  }
}

/**
 * Google Forms installable trigger handler.
 * Trigger type: On form submit.
 */
function onFormSubmit(e) {
  var values = (e && e.namedValues) || {};

  var payload = {
    leadName: pick(values, ["Lead Name"]),
    ficoBand: pick(values, ["FICO Band"]),
    utilizationBand: pick(values, ["Utilization Band"]),
    bankruptcy: pick(values, ["Bankruptcy", "Bankruptcy (Y/N)"]),
    recentLates: pick(values, ["Recent Lates", "Recent Lates (Y/N)"]),
    sourceLeadId: buildSourceLeadId(values),
    source: "google",
  };

  var response = sendToIntake(payload);
  var status = response.getResponseCode();
  var body = response.getContentText();

  if (status < 200 || status >= 300) {
    throw new Error("Intake API failed. Status: " + status + " Body: " + body);
  }
}

function sendToIntake(payload) {
  var apiKey = PropertiesService.getScriptProperties().getProperty(INTAKE_API_KEY_PROPERTY);
  if (!apiKey) {
    throw new Error("Missing INTAKE_API_KEY in Script Properties. Run setIntakeApiKey() first.");
  }

  return UrlFetchApp.fetch(INTAKE_API_URL, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: {
      "x-intake-key": apiKey,
    },
    payload: JSON.stringify(payload),
  });
}

function mapWebhookPayload(inbound) {
  var invitee = inbound.invitee || {};

  // Keep this mapping tolerant: any missing qualifiers will be CHECK_MANUALLY.
  return {
    leadName: firstNonEmpty([
      inbound.leadName,
      inbound.name,
      invitee.name,
      inbound.eventType,
      "Calendly Lead",
    ]),
    ficoBand: inbound.ficoBand || "",
    utilizationBand: inbound.utilizationBand || "",
    bankruptcy: inbound.bankruptcy || "",
    recentLates: inbound.recentLates || "",
    sourceLeadId: firstNonEmpty([inbound.eventUri, inbound.inviteeUri, inbound.event, "webhook_submission"]),
    source: "calendly",
  };
}

function pick(namedValues, keys) {
  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i];
    var value = namedValues[key];
    if (value && value.length > 0) {
      return String(value[0]).trim();
    }
  }
  return "";
}

function firstNonEmpty(values) {
  for (var i = 0; i < values.length; i += 1) {
    if (values[i]) {
      return String(values[i]).trim();
    }
  }
  return "";
}

function buildSourceLeadId(namedValues) {
  var timestamp = pick(namedValues, ["Timestamp", "Submission Time"]);
  var leadName = pick(namedValues, ["Lead Name"]);
  return [timestamp, leadName].filter(Boolean).join("|") || "form_submission";
}
