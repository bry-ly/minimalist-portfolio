import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface ContactNotificationProps {
  name: string;
  email: string;
  message: string;
}

export const ContactNotification: React.FC<ContactNotificationProps> = ({
  name,
  email,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New contact from {name} - Portfolio Website</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container
          style={{ margin: "0 auto", padding: "32px 16px", maxWidth: "600px" }}
        >
          {/* Header Section */}
          <Section
            style={{
              backgroundColor: "#111827",
              borderRadius: "8px 8px 0 0",
              padding: "24px 32px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "600",
                margin: "0",
              }}
            >
              📬 New Contact Form Submission
            </Heading>
            <Text
              style={{
                color: "#e5e7eb",
                fontSize: "14px",
                margin: "8px 0 0 0",
              }}
            >
              Someone reached out through your portfolio website
            </Text>
          </Section>

          {/* Main Content */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0 0 8px 8px",
              border: "1px solid #e5e7eb",
              borderTop: "none",
              padding: "32px",
            }}
          >
            {/* Contact Details */}
            <Section style={{ marginBottom: "24px" }}>
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Contact Information
              </Text>

              <Section
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  padding: "16px",
                }}
              >
                <Text style={{ margin: "0 0 12px 0" }}>
                  <strong style={{ color: "#111827", fontSize: "14px" }}>
                    Name:
                  </strong>
                  <br />
                  <span style={{ color: "#374151", fontSize: "16px" }}>
                    {name}
                  </span>
                </Text>

                <Text style={{ margin: "0" }}>
                  <strong style={{ color: "#111827", fontSize: "14px" }}>
                    Email:
                  </strong>
                  <br />
                  <Link
                    href={`mailto:${email}`}
                    style={{
                      color: "#2563eb",
                      fontSize: "16px",
                      textDecoration: "none",
                    }}
                  >
                    {email}
                  </Link>
                </Text>
              </Section>
            </Section>

            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #e5e7eb",
                margin: "24px 0",
              }}
            />

            {/* Message Content */}
            <Section>
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Message
              </Text>

              <Section
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  padding: "16px",
                  borderLeft: "4px solid #2563eb",
                }}
              >
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    margin: "0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message}
                </Text>
              </Section>
            </Section>

            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #e5e7eb",
                margin: "24px 0",
              }}
            />

            {/* Quick Actions */}
            <Section style={{ textAlign: "center" }}>
              <Link
                href={`mailto:${email}?subject=Re: Your inquiry from bryanpalay.me`}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Reply to {name}
              </Link>
            </Section>

            {/* Footer Note */}
            <Section style={{ marginTop: "24px" }}>
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  textAlign: "center",
                  margin: "0",
                }}
              >
                💡 Tip: Click the button above to reply directly, or use your
                email client's reply function.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            <Text
              style={{
                color: "#6b7280",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              This notification was sent from your portfolio contact form at{" "}
              <Link
                href="https://www.bryanpalay.me"
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                bryanpalay.me
              </Link>
            </Text>
            <Text
              style={{
                color: "#6b7280",
                fontSize: "12px",
                lineHeight: "1.6",
                marginTop: "8px",
              }}
            >
              © 2025 Bryan Palay. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactNotification;
