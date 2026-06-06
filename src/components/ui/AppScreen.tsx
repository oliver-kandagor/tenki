import { ImageBackground, ImageSourcePropType, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { colors, space } from '@/theme/tokens';
import { type } from '@/theme/typography';

interface AppScreenProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  bgImage?: ImageSourcePropType;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
  onBack?: () => void;
}

export function AppScreen({
  children,
  title,
  subtitle,
  rightAction,
  footer,
  scrollable = true,
  style,
  bgImage,
  onRefresh,
  refreshing = false,
  onBack,
}: AppScreenProps) {
  const header = (title || rightAction || onBack) && (
    <View style={[styles.header, onBack && styles.headerWithBack]}>
      {onBack && (
        <Pressable onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Feather name="chevron-left" size={28} color={colors.text.primary} />
        </Pressable>
      )}
      <View style={styles.headerText}>
        {title && <Text style={type.title}>{title}</Text>}
        {subtitle && <Text style={type.body}>{subtitle}</Text>}
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );

  const body = scrollable ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, style]}
      showsVerticalScrollIndicator={false}
      refreshControl={onRefresh && (
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#8B5CF6"
          colors={['#8B5CF6']}
        />
      )}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, style]}>{children}</View>
  );

  const safeArea = (
    <SafeAreaView style={[styles.safe, bgImage ? { backgroundColor: 'transparent' } : undefined]} edges={['top']}>
      {header}
      {body}
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );

  if (bgImage) {
    return (
      <ImageBackground source={bgImage} style={styles.flex} resizeMode="cover">
        <View style={styles.scrim}>
          {safeArea}
        </View>
      </ImageBackground>
    );
  }

  return safeArea;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.root,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.xl,
    paddingBottom: space.md,
  },
  headerWithBack: {
    alignItems: 'center',
  },
  backButton: {
    marginRight: space.sm,
    marginLeft: -space.xs,
    padding: space.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  headerText: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: space.lg,
    paddingBottom: 100, // clear tab bar
  },
  footer: {
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 14, 0.5)', // Adds a dark tint over the image for text legibility
  },
});
