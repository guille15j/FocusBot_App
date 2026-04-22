import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, Dimensions, useColorScheme, Platform, Animated, TouchableOpacity } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import BotCard from './BotCard';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const BotCarousel = ({ bots = [], onAddPress, globalStyles }) => {
  const scheme = useColorScheme();
  const AppColors = useMemo(() => getColors(scheme), [scheme]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current; 
  const flatListRef = useRef(null);
  const isWeb = Platform.OS === 'web';

  const CARD_WIDTH = isWeb ? WINDOW_WIDTH * 0.5 : WINDOW_WIDTH * 0.85;
  const SPACING = 10;
  const FULL_ITEM_WIDTH = CARD_WIDTH + SPACING;
  const ARROW_OFFSET_WEB = -(WINDOW_WIDTH * 0.12); 

  const styles = getStyles(AppColors, CARD_WIDTH, SPACING, isWeb, ARROW_OFFSET_WEB);
  const data = [{ id: 'add-button', isAddButton: true }, ...bots];

  useEffect(() => {
    if (bots.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: 1, animated: true });
        setCurrentIndex(1);
      }, 100);
    }
  }, [CARD_WIDTH]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false, 
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / FULL_ITEM_WIDTH);
        if (index !== currentIndex) setCurrentIndex(index);
      },
    }
  );

  const scrollToIndex = (index) => {
    if (index >= 0 && index < data.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * FULL_ITEM_WIDTH,
      index * FULL_ITEM_WIDTH,
      (index + 1) * FULL_ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.cardContainer, { transform: [{ scale }], opacity }]}>
        {item.isAddButton ? (
          <Surface style={styles.addCard} elevation={2}>
            <IconButton
              icon="plus"
              size={50}
              mode="contained"
              iconColor="white"
              containerColor={AppColors.primary}
              onPress={onAddPress}
            />
          </Surface>
        ) : (
          <BotCard item={item} AppColors={AppColors} globalStyles={globalStyles} />
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.carouselContainer}>
        {isWeb && (
          <IconButton
            icon="chevron-left"
            mode="contained-tonal"
            disabled={currentIndex === 0}
            onPress={() => scrollToIndex(currentIndex - 1)}
            style={[styles.navButton, styles.leftButton]}
            containerColor={AppColors.surface}
          />
        )}

        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) => item.id || (item.bot_id ? item.bot_id.toString() : index.toString())}
          showsHorizontalScrollIndicator={false}
          snapToInterval={FULL_ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={isWeb ? { overflowX: 'hidden' } : {}}
          getItemLayout={(data, index) => ({
            length: FULL_ITEM_WIDTH,
            offset: FULL_ITEM_WIDTH * index,
            index,
          })}
        />

        {isWeb && (
          <IconButton
            icon="chevron-right"
            mode="contained-tonal"
            disabled={currentIndex === data.length - 1}
            onPress={() => scrollToIndex(currentIndex + 1)}
            style={[styles.navButton, styles.rightButton]}
            containerColor={AppColors.surface}
          />
        )}
      </View>

      <View style={styles.pagination}>
        {data.map((_, index) => {
          const isSelected = currentIndex === index;
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => scrollToIndex(index)}
              activeOpacity={0.7}
              style={styles.dotTouchTarget}
            >
              {index === 0 ? (
                <View style={styles.plusDotContainer}>
                  <Text 
                    style={[
                      styles.plusIcon, 
                      { color: isSelected ? AppColors.primary : AppColors.placeholder }
                    ]}
                  >
                    +
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: isSelected ? AppColors.primary : AppColors.placeholder },
                    isSelected && styles.activeDot
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (AppColors, CARD_WIDTH, SPACING, isWeb, ARROW_OFFSET_WEB) => StyleSheet.create({
  mainWrapper: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  carouselContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: isWeb ? CARD_WIDTH : WINDOW_WIDTH,
    justifyContent: 'center',
  },
  flatListContent: {
    paddingHorizontal: isWeb ? 0 : (WINDOW_WIDTH - CARD_WIDTH) / 2,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    justifyContent: 'center',
    elevation: 4
  },
  addCard: {
    margin: 8,
    borderRadius: 15,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: AppColors.primary,
  },
  navButton: {
    position: 'absolute',
    zIndex: 999,
    margin: 0,
    elevation: 5,
  },
  leftButton: { left: ARROW_OFFSET_WEB },
  rightButton: { right: ARROW_OFFSET_WEB },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  dotTouchTarget: {
    padding: 4, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusDotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  activeDot: {
    width: 16,
    borderRadius: 4,
    opacity: 1,
  },
});

export default BotCarousel;