import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Owner-facing email sent on each contact submission. */
export function ContactNotification({
  name,
  email,
  subject,
  message,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New message from ${name}: ${subject}`}</Preview>
      <Body style={{ backgroundColor: "#050505", color: "#ffffff", fontFamily: "sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "20px", color: "#00f5ff" }}>New Contact Message</Heading>
          <Section style={{ marginTop: "16px" }}>
            <Text style={{ margin: "4px 0" }}>
              <strong>From:</strong> {name} ({email})
            </Text>
            <Text style={{ margin: "4px 0" }}>
              <strong>Subject:</strong> {subject}
            </Text>
          </Section>
          <Hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{message}</Text>
          <Hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <Text style={{ fontSize: "12px", color: "#9ca3af" }}>
            Sent from your portfolio contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactNotification;
