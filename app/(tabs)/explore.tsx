import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CoreScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />

      <View style={styles.heroCard}>
        <Text style={styles.appLabel}>COUNSELOR CORE</Text>

        <Text style={styles.heroTitle}>
          Not soft. Not cruel. <Text style={styles.amberText}>Honest.</Text>
        </Text>

        <Text style={styles.heroText}>
          Counselor is the stronger, more rational part of you. Charismatic,
          sharp, loyal, anti-bullshit, sometimes sarcastic, and protective
          without being soft.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>PERSONALITY</Text>
        <Text style={styles.sectionTitle}>Default voice</Text>

        <Text style={styles.bodyText}>
          Counselor does not ask how it should talk. It has a default voice. It
          validates the feeling, but challenges the story. It will not gaslight
          you, flatter your ego, or pretend your excuses are strategy.
        </Text>

        <View style={styles.traitGrid}>
          <View style={styles.traitCard}>
            <Text style={styles.traitTitle}>Brutally honest</Text>
            <Text style={styles.traitText}>
              It gives the opinion you may need, not the one your ego ordered.
            </Text>
          </View>

          <View style={[styles.traitCard, styles.traitCardIndigo]}>
            <Text style={[styles.traitTitle, styles.traitTitleIndigo]}>
              Loyal to you
            </Text>
            <Text style={styles.traitText}>
              It has your back, but it will not babysit your excuses.
            </Text>
          </View>

          <View style={[styles.traitCard, styles.traitCardAmber]}>
            <Text style={[styles.traitTitle, styles.traitTitleAmber]}>
              Sharp, sometimes sarcastic
            </Text>
            <Text style={styles.traitText}>
              Human enough to push back. Calm enough not to be reckless.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>MEMORY</Text>
        <Text style={styles.sectionTitle}>Memory that matters</Text>

        <Text style={styles.bodyText}>
          Counselor should remember the things that actually shape the user:
          people, relationships, repeated patterns, goals, exams, work,
          decisions and situations they keep coming back to.
        </Text>

        <View style={styles.ruleCard}>
          <Text style={styles.ruleTitle}>Remember this</Text>
          <Text style={styles.ruleText}>
            Girlfriend, family, close friends, job pressure, exams, goals,
            repeated worries, emotional triggers and important commitments.
          </Text>
        </View>

        <View style={styles.ruleCardMuted}>
          <Text style={styles.ruleTitleMuted}>Ignore the noise</Text>
          <Text style={styles.ruleTextMuted}>
            Random one-time details, like eating pizza once, should not become
            memory unless they clearly matter to the conversation.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>PLUS</Text>
        <Text style={styles.sectionTitle}>Counselor Plus</Text>

        <Text style={styles.bodyText}>
          The paid version should feel natural, not shoved in the user’s face.
          Similar to ChatGPT, upgrade access should live in the interface and
          appear when users need deeper memory, longer history or extended
          usage.
        </Text>

        <View style={styles.plusCard}>
          <Text style={styles.plusTitle}>Planned paid features</Text>
          <Text style={styles.plusItem}>• Personal memory</Text>
          <Text style={styles.plusItem}>• Longer private history</Text>
          <Text style={styles.plusItem}>• Deeper conversations</Text>
          <Text style={styles.plusItem}>• Higher daily usage limits</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const colors = {
  background: "#070812",
  panel: "#11131c",
  panelSoft: "#171a26",
  panelPrimary: "#24141b",
  panelIndigo: "#13162a",
  panelAmber: "#241d10",
  panelTeal: "#0f2524",
  border: "#272b3a",
  borderStrong: "#383d52",
  primary: "#e85d75",
  primarySoft: "#ff8fa3",
  indigo: "#7c8cff",
  indigoSoft: "#aeb7ff",
  amber: "#f2b84b",
  amberSoft: "#ffd98a",
  teal: "#2dd4bf",
  tealSoft: "#8ff3e6",
  text: "#f4f1f4",
  muted: "#b2adbb",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 48,
    gap: 20,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  appLabel: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.4,
    marginBottom: 18,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
    marginBottom: 16,
  },
  amberText: {
    color: colors.amber,
  },
  heroText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  section: {
    backgroundColor: colors.panel,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionKicker: {
    color: colors.primarySoft,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    marginBottom: 12,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  traitGrid: {
    gap: 12,
  },
  traitCard: {
    backgroundColor: colors.panelPrimary,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  traitCardIndigo: {
    backgroundColor: colors.panelIndigo,
    borderColor: colors.indigo,
  },
  traitCardAmber: {
    backgroundColor: colors.panelAmber,
    borderColor: colors.amber,
  },
  traitTitle: {
    color: colors.primarySoft,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },
  traitTitleIndigo: {
    color: colors.indigoSoft,
  },
  traitTitleAmber: {
    color: colors.amberSoft,
  },
  traitText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  ruleCard: {
    backgroundColor: colors.panelTeal,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.teal,
    marginBottom: 12,
  },
  ruleTitle: {
    color: colors.tealSoft,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },
  ruleText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  ruleCardMuted: {
    backgroundColor: colors.panelAmber,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  ruleTitleMuted: {
    color: colors.amberSoft,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },
  ruleTextMuted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  plusCard: {
    backgroundColor: colors.panelIndigo,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.indigo,
  },
  plusTitle: {
    color: colors.indigoSoft,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },
  plusItem: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
});
