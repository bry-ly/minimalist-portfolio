import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  firstName?: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  firstName = "there",
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Thank you for reaching out - I'll respond within 24-48 hours
      </Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container
          style={{ margin: "0 auto", padding: "32px 16px", maxWidth: "600px" }}
        >
          {/* Main Card */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              padding: "32px",
            }}
          >
            {/* Profile Image */}
            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <Img
                src="https://www.bryanpalay.me/bryan.jpg"
                alt="Bryan Palay"
                width="100"
                height="100"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e5e7eb",
                  margin: "0 auto",
                }}
              />
            </Section>

            {/* Greeting */}
            <Heading
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "16px",
              }}
            >
              Hi {firstName},
            </Heading>

            {/* Thank you message */}
            <Text
              style={{
                color: "#374151",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}
            >
              Thank you for reaching out! I've received your message and truly
              appreciate you taking the time to connect with me.
            </Text>

            {/* Response time */}
            <Text
              style={{
                color: "#374151",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}
            >
              I review all messages personally and will get back to you within{" "}
              <strong style={{ color: "#111827" }}>24-48 hours</strong>. In the
              meantime, feel free to explore my work and projects at{" "}
              <Link
                href="https://www.bryanpalay.me"
                style={{ color: "#2563eb", textDecoration: "underline" }}
              >
                bryanpalay.me
              </Link>
              .
            </Text>

            {/* Social Links Section */}
            <Section
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <Text
                style={{
                  color: "#374151",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  marginBottom: "12px",
                }}
              >
                If your inquiry is urgent, you can also connect with me on:
              </Text>

              <Text style={{ fontSize: "14px", margin: "8px 0" }}>
                <strong style={{ color: "#111827" }}>X (Twitter):</strong>{" "}
                <Link
                  href="https://x.com/bry_ly28"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  @bry_ly28
                </Link>
              </Text>

              <Text style={{ fontSize: "14px", margin: "8px 0" }}>
                <strong style={{ color: "#111827" }}>GitHub:</strong>{" "}
                <Link
                  href="https://github.com/bry-ly"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  github.com/bry-ly
                </Link>
              </Text>
            </Section>

            {/* Closing */}
            <Text
              style={{
                color: "#374151",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              Looking forward to our conversation!
            </Text>

            {/* Signature */}
            <Section
              style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}
            >
              <Text
                style={{
                  color: "#111827",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "4px",
                }}
              >
                Best regards,
              </Text>
              <Text
                style={{
                  color: "#111827",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "0",
                }}
              >
                Bryan Palay
              </Text>
              <Text
                style={{
                  color: "#4b5563",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                Full-Stack Developer
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
              This is an automated response to confirm receipt of your message.
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

export default EmailTemplate;
