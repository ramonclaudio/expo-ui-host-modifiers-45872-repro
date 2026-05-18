import {
  Button,
  Host,
  HStack,
  Image,
  Picker,
  ProgressView,
  Slider,
  Text as SText,
  Toggle,
  VStack,
} from '@expo/ui/swift-ui';
import {
  background,
  blur,
  border,
  buttonStyle,
  cornerRadius,
  disabled,
  font,
  foregroundStyle,
  glassEffect,
  grayscale,
  onTapGesture,
  opacity,
  padding,
  pickerStyle,
  rotationEffect,
  scaleEffect,
  shadow,
  tag,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const PR_URL = 'https://github.com/expo/expo/pull/45872';

const COLORS = {
  bg: '#08090C',
  card: '#14161D',
  border: '#22252F',
  text: '#F4F4F5',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  accent: '#A78BFA',
  rose: '#FB7185',
  emerald: '#34D399',
  amber: '#FBBF24',
  cyan: '#22D3EE',
};

function Card({
  title,
  desc,
  modifier,
  children,
}: {
  title: string;
  desc?: string;
  modifier?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {desc ? <Text style={styles.cardDesc}>{desc}</Text> : null}
      <View style={styles.cardBody}>{children}</View>
      {modifier ? <Text style={styles.modifier}>{modifier}</Text> : null}
    </View>
  );
}

function Compare({
  left,
  right,
  height = 36,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  height?: number;
}) {
  const boxStyle = [styles.hostBox, { height: height + 24 }];
  return (
    <View style={styles.stack}>
      <Text style={styles.colLabel}>DEFAULT</Text>
      <View style={boxStyle}>{left}</View>
      <Text style={[styles.colLabel, styles.modifierLabel]}>WITH MODIFIER</Text>
      <View style={boxStyle}>{right}</View>
    </View>
  );
}

export default function HostModifiersDemo() {
  const [t1, setT1] = useState(true);
  const [t2, setT2] = useState(true);
  const [s1, setS1] = useState(0.6);
  const [s2, setS2] = useState(0.6);
  const [p1, setP1] = useState(1);
  const [p2, setP2] = useState(1);
  const [tapCount, setTapCount] = useState(0);

  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>iOS only.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable onPress={() => Linking.openURL(PR_URL)}>
            <Text style={styles.eyebrow}>expo/expo#45872 · @expo/ui · swift-ui</Text>
          </Pressable>
          <Text style={styles.title}>Host modifiers</Text>
          <Text style={styles.lede}>
            Before this PR, <Text style={styles.code}>{'<Host modifiers={...}>'}</Text>{' '}
            typechecked but did nothing on iOS. After: every SwiftUI child inside the Host inherits
            the modifier chain. Tap the badge above to open the PR.
          </Text>
        </View>

        <Card
          title="1. tint — Toggle"
          desc="Default toggle uses the system green. Wrapping in a Host with tint() recolors it."
          modifier="modifiers={[tint('#FB7185')]}">
          <Compare
            left={
              <Host style={styles.fill} colorScheme="light">
                <Toggle isOn={t1} onIsOnChange={setT1} label="Notifications" />
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[tint(COLORS.rose)]}>
                <Toggle isOn={t2} onIsOnChange={setT2} label="Notifications" />
              </Host>
            }
          />
        </Card>

        <Card
          title="2. tint — Slider"
          desc="System blue → rose. Same control, same value, only the wrapper changed."
          modifier="modifiers={[tint('#FB7185')]}">
          <Compare
            left={
              <Host style={styles.fill} colorScheme="light">
                <Slider value={s1} onValueChange={setS1} min={0} max={1} />
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[tint(COLORS.rose)]}>
                <Slider value={s2} onValueChange={setS2} min={0} max={1} />
              </Host>
            }
          />
        </Card>

        <Card
          title="3. tint — Picker (menu)"
          desc="The pull-down chevron and selected check inherit the tint."
          modifier="modifiers={[tint('#FB7185'), pickerStyle('menu')]}">
          <Compare
            height={44}
            left={
              <Host style={styles.fill} colorScheme="light">
                <Picker
                  selection={p1}
                  onSelectionChange={setP1}
                  modifiers={[pickerStyle('menu')]}>
                  <SText modifiers={[tag(0)]}>Daily</SText>
                  <SText modifiers={[tag(1)]}>Weekly</SText>
                  <SText modifiers={[tag(2)]}>Monthly</SText>
                </Picker>
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[tint(COLORS.rose)]}>
                <Picker
                  selection={p2}
                  onSelectionChange={setP2}
                  modifiers={[pickerStyle('menu')]}>
                  <SText modifiers={[tag(0)]}>Daily</SText>
                  <SText modifiers={[tag(1)]}>Weekly</SText>
                  <SText modifiers={[tag(2)]}>Monthly</SText>
                </Picker>
              </Host>
            }
          />
        </Card>

        <Card
          title="4. tint — Button"
          desc="The borderedProminent button uses tint for its fill."
          modifier="modifiers={[tint('#FB7185')]}">
          <Compare
            height={44}
            left={
              <Host style={styles.fill} colorScheme="light">
                <Button
                  label="Continue"
                  onPress={() => {}}
                  modifiers={[buttonStyle('borderedProminent')]}
                />
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[tint(COLORS.rose)]}>
                <Button
                  label="Continue"
                  onPress={() => {}}
                  modifiers={[buttonStyle('borderedProminent')]}
                />
              </Host>
            }
          />
        </Card>

        <Card
          title="5. tint — ProgressView"
          desc="Linear bar inherits the tint."
          modifier="modifiers={[tint('#FB7185')]}">
          <Compare
            height={20}
            left={
              <Host style={styles.fill} colorScheme="light">
                <ProgressView value={s1} />
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[tint(COLORS.rose)]}>
                <ProgressView value={s2} />
              </Host>
            }
          />
        </Card>

        <Card
          title="6. tint — one Host themes a whole stack"
          desc="The wrapper applies once, every nested control adopts it. This is the pitch."
          modifier="modifiers={[tint('#FB7185')]}">
          <Compare
            height={150}
            left={
              <Host style={styles.fill} colorScheme="light">
                <VStack spacing={10}>
                  <Toggle isOn={t1} onIsOnChange={setT1} label="Notifications" />
                  <Slider value={s1} onValueChange={setS1} min={0} max={1} />
                  <Button
                    label="Save"
                    onPress={() => {}}
                    modifiers={[buttonStyle('borderedProminent')]}
                  />
                </VStack>
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[tint(COLORS.rose)]}>
                <VStack spacing={10}>
                  <Toggle isOn={t2} onIsOnChange={setT2} label="Notifications" />
                  <Slider value={s2} onValueChange={setS2} min={0} max={1} />
                  <Button
                    label="Save"
                    onPress={() => {}}
                    modifiers={[buttonStyle('borderedProminent')]}
                  />
                </VStack>
              </Host>
            }
          />
        </Card>

        <Card
          title="7. tint — swap accents on demand"
          desc="The same stack rendered four times. The Host wrapper IS the theme."
          modifier="tint(...) per Host">
          <View style={styles.grid2}>
            {[
              { label: 'System', color: undefined },
              { label: 'Rose', color: COLORS.rose },
              { label: 'Emerald', color: COLORS.emerald },
              { label: 'Amber', color: COLORS.amber },
            ].map((b) => (
              <View key={b.label} style={styles.gridCell}>
                <Text style={[styles.colLabel, { color: b.color ?? COLORS.textMuted }]}>
                  {b.label.toUpperCase()}
                </Text>
                <View style={[styles.hostBox, { height: 150 }]}>
                  <Host
                    style={styles.fill}
                    colorScheme="light"
                    modifiers={b.color ? [tint(b.color)] : undefined}>
                    <VStack spacing={10}>
                      <Toggle isOn={t1} onIsOnChange={setT1} label="On" />
                      <Slider value={s1} onValueChange={setS1} min={0} max={1} />
                      <Button
                        label="Save"
                        onPress={() => {}}
                        modifiers={[buttonStyle('borderedProminent')]}
                      />
                    </VStack>
                  </Host>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card
          title="8. font cascade"
          desc="Default system font → rounded bold via one modifier on the wrapper."
          modifier="modifiers={[font({ size: 18, weight: 'bold', design: 'rounded' })]}">
          <Compare
            height={70}
            left={
              <Host style={styles.fill} colorScheme="light">
                <VStack alignment="leading" spacing={4}>
                  <SText>Heading</SText>
                  <SText>Subtitle line</SText>
                </VStack>
              </Host>
            }
            right={
              <Host
                style={styles.fill}
                colorScheme="light"
                modifiers={[font({ size: 18, weight: 'bold', design: 'rounded' })]}>
                <VStack alignment="leading" spacing={4}>
                  <SText>Heading</SText>
                  <SText>Subtitle line</SText>
                </VStack>
              </Host>
            }
          />
        </Card>

        <Card
          title="9. foregroundStyle"
          desc="Text and SF Symbols pick up the color from the Host."
          modifier="modifiers={[foregroundStyle('#22D3EE')]}">
          <Compare
            left={
              <Host style={styles.fill} colorScheme="light">
                <HStack spacing={8} alignment="center">
                  <Image systemName="star.fill" size={18} />
                  <SText>Featured</SText>
                </HStack>
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[foregroundStyle(COLORS.cyan)]}>
                <HStack spacing={8} alignment="center">
                  <Image systemName="star.fill" size={18} />
                  <SText>Featured</SText>
                </HStack>
              </Host>
            }
          />
        </Card>

        <Card
          title="10. disabled cascade"
          desc="One modifier on the Host disables every nested control."
          modifier="modifiers={[disabled(true)]}">
          <Compare
            height={90}
            left={
              <Host style={styles.fill} colorScheme="light">
                <VStack spacing={10}>
                  <Toggle isOn={t1} onIsOnChange={setT1} label="Sync" />
                  <Slider value={s1} onValueChange={setS1} min={0} max={1} />
                </VStack>
              </Host>
            }
            right={
              <Host style={styles.fill} colorScheme="light" modifiers={[disabled(true)]}>
                <VStack spacing={10}>
                  <Toggle isOn={t2} onIsOnChange={setT2} label="Sync" />
                  <Slider value={s2} onValueChange={setS2} min={0} max={1} />
                </VStack>
              </Host>
            }
          />
        </Card>

        <Card
          title="11. chrome — background, cornerRadius, border, shadow"
          desc="Stack modifiers to draw a real card around the SwiftUI subtree."
          modifier="modifiers={[padding({ all: 16 }), background('#0F172A'), cornerRadius(16), border({ color: '#A78BFA', width: 1 }), shadow({ radius: 14, y: 6, color: '#00000088' })]}">
          <View style={styles.stage}>
            <Host
              matchContents
              colorScheme="dark"
              modifiers={[
                padding({ all: 16 }),
                background('#0F172A'),
                cornerRadius(16),
                border({ color: COLORS.accent, width: 1 }),
                shadow({ radius: 14, y: 6, color: '#00000088' }),
              ]}>
              <HStack spacing={10} alignment="center">
                <Image systemName="bolt.fill" size={20} color={COLORS.accent} />
                <SText>Boxed by Host modifiers</SText>
              </HStack>
            </Host>
          </View>
        </Card>

        <Card
          title="12. transform — rotation + scale"
          desc="The receiver and its children rasterize through the transform."
          modifier="modifiers={[padding({ all: 14 }), background('#A78BFA'), cornerRadius(12), rotationEffect(-6), scaleEffect(1.04)]}">
          <View style={styles.stage}>
            <Host
              matchContents
              colorScheme="dark"
              modifiers={[
                padding({ all: 14 }),
                background(COLORS.accent),
                cornerRadius(12),
                rotationEffect(-6),
                scaleEffect(1.04),
              ]}>
              <SText>Tilted & scaled</SText>
            </Host>
          </View>
        </Card>

        <Card
          title="13. filters — blur, opacity, grayscale"
          desc="Apply to the receiver's rendered output. Useful for modal backdrops."
          modifier="modifiers={[blur(3), opacity(0.5), grayscale(0.5)]}">
          <Compare
            height={84}
            left={
              <Host style={styles.fill} colorScheme="light">
                <VStack spacing={8}>
                  <Toggle isOn={t1} onIsOnChange={setT1} label="Sync" />
                  <Slider value={s1} onValueChange={setS1} min={0} max={1} />
                </VStack>
              </Host>
            }
            right={
              <Host
                matchContents
                colorScheme="light"
                modifiers={[blur(3), opacity(0.5), grayscale(0.5)]}>
                <VStack spacing={8}>
                  <Toggle isOn={t2} onIsOnChange={setT2} label="Sync" />
                  <Slider value={s2} onValueChange={setS2} min={0} max={1} />
                </VStack>
              </Host>
            }
          />
        </Card>

        <Card
          title="14. onTapGesture"
          desc={`The entire SwiftUI subtree is a tap target wired back to React state. Counter: ${tapCount}`}
          modifier="modifiers={[..., onTapGesture(() => setTapCount(n => n + 1))]}">
          <View style={styles.stage}>
            <Host
              matchContents
              colorScheme="dark"
              modifiers={[
                padding({ vertical: 14, horizontal: 22 }),
                background(COLORS.emerald),
                cornerRadius(999),
                shadow({ radius: 12, y: 6, color: '#10B98199' }),
                onTapGesture(() => setTapCount((n) => n + 1)),
              ]}>
              <HStack spacing={10} alignment="center">
                <Image systemName="hand.tap.fill" size={18} color="#0F172A" />
                <SText>Tap me ({tapCount})</SText>
              </HStack>
            </Host>
          </View>
        </Card>

        <Card
          title="15. glassEffect — iOS 26 Liquid Glass"
          desc="Render a SwiftUI material via the Host's modifier chain."
          modifier="modifiers={[glassEffect({ glass: { variant: 'regular', interactive: true }, shape: 'capsule' }), padding({ vertical: 12, horizontal: 18 }), tint('#FFFFFF')]}">
          <View style={styles.glassStage}>
            <View style={styles.blobA} />
            <View style={styles.blobB} />
            <View style={styles.glassSlot}>
              <Host
                matchContents
                colorScheme="dark"
                modifiers={[
                  glassEffect({
                    glass: { variant: 'regular', interactive: true },
                    shape: 'capsule',
                  }),
                  padding({ vertical: 12, horizontal: 18 }),
                  tint('#FFFFFF'),
                ]}>
                <HStack spacing={22} alignment="center">
                  <Image systemName="house.fill" size={22} />
                  <Image systemName="magnifyingglass" size={22} />
                  <Image systemName="bell.fill" size={22} />
                  <Image systemName="person.crop.circle.fill" size={22} />
                </HStack>
              </Host>
            </View>
          </View>
        </Card>

        <Text style={styles.footer}>
          Every card uses the PR fix: `HostViewProps` declares `modifiers`, and `HostView.body`
          chains `.applyModifiers(...)` between the host's environment modifiers and
          `GeometryChangeModifier`. Without it, the right column would look identical to the left.
        </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, gap: 14, paddingBottom: 140 },
  header: { gap: 6, marginBottom: 4 },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: { color: COLORS.text, fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  lede: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19 },
  code: { color: COLORS.accent, fontFamily: 'Menlo', fontSize: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  cardDesc: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
  cardBody: { marginTop: 6 },
  modifier: {
    color: COLORS.textMuted,
    fontFamily: 'Menlo',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  stack: { gap: 6 },
  modifierLabel: { color: COLORS.rose, marginTop: 10 },
  colLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hostBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
  },
  fill: { flex: 1, alignSelf: 'stretch' },
  stage: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridCell: { width: '48%', gap: 4 },
  glassStage: {
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1B0F2E',
    justifyContent: 'flex-end',
    padding: 14,
  },
  blobA: {
    position: 'absolute',
    top: -40,
    left: -30,
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: '#7C3AED',
    opacity: 0.6,
  },
  blobB: {
    position: 'absolute',
    top: 20,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: '#EC4899',
    opacity: 0.55,
  },
  glassSlot: { alignItems: 'center' },
  footer: { color: COLORS.textMuted, fontSize: 11, lineHeight: 16, paddingHorizontal: 4 },
});
