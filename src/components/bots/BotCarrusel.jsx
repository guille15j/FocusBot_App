import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  Platform,
  Animated,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import BotCard from './BotCard';

const BotCarousel = ({ bots = [], onAddPress, globalStyles, onIndexChange, addProp = false }) => {
  const scheme = useColorScheme();
  const AppColors = useMemo(() => getColors(scheme), [scheme]);
  const { width: windowWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const CARD_WIDTH = isWeb ? windowWidth * 0.5 : windowWidth * 0.85;
  const SPACING = 10;
  const FULL_ITEM_WIDTH = CARD_WIDTH + SPACING;
  const ARROW_OFFSET_WEB = -(windowWidth * 0.12);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const initialScrollDone = useRef(false);

  const localStyles = useMemo(
    () => ({
      mainWrapper: {
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
      },
      carouselContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: isWeb ? CARD_WIDTH : '100%',
        justifyContent: 'center',
      },
      flatListContent: {
        paddingHorizontal: isWeb ? 0 : (windowWidth - CARD_WIDTH) / 2,
        alignItems: 'center',
      },
      cardContainer: {
        width: CARD_WIDTH,
        marginRight: SPACING,
        justifyContent: 'center',
        elevation: 4,
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
    }),
    [AppColors, CARD_WIDTH, SPACING, isWeb, windowWidth, ARROW_OFFSET_WEB]
  );

  // Construir datos condicionalmente: si addProp es true, incluimos el botón de añadir
  const data = useMemo(() => {
    if (addProp) {
      return [{ id: 'add-button', isAddButton: true }, ...bots];
    }
    return bots.length > 0 ? bots : []; // si no hay bots, array vacío
  }, [addProp, bots]);

  // Scroll inicial: si hay addButton, al índice 1; si no, al 0 (solo una vez)
  useEffect(() => {
    if (flatListRef.current && data.length > 0 && !initialScrollDone.current) {
      const targetIndex = addProp ? 1 : 0;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
        setCurrentIndex(targetIndex);
        initialScrollDone.current = true;
      }, 100);
    }
  }, [data, addProp]);

  useEffect(() => {
    if (onIndexChange) {
      // Pasamos el bot actual basado en el índice
      onIndexChange(data[currentIndex]);
    }
  }, [currentIndex, data, onIndexChange]);

  // Ajustar el scroll cuando cambia el ancho
  useEffect(() => {
    if (flatListRef.current && FULL_ITEM_WIDTH > 0) {
      const offset = currentIndex * FULL_ITEM_WIDTH;
      flatListRef.current.scrollToOffset({ offset, animated: false });
    }
  }, [FULL_ITEM_WIDTH]);

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
      <Animated.View style={[localStyles.cardContainer, { transform: [{ scale }], opacity }]}>
        {item.isAddButton ? (
          <Surface style={localStyles.addCard} elevation={2}>
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
    <View style={localStyles.mainWrapper}>
      <View style={localStyles.carouselContainer}>
        {isWeb && (
          <IconButton
            icon="chevron-left"
            mode="contained-tonal"
            disabled={currentIndex === 0}
            onPress={() => scrollToIndex(currentIndex - 1)}
            style={[localStyles.navButton, localStyles.leftButton]}
            containerColor={AppColors.surface}
          />
        )}
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          horizontal
          keyExtractor={(item) =>
            item.id || (item.bot_id ? item.bot_id.toString() : Math.random().toString())
          }
          showsHorizontalScrollIndicator={false}
          snapToInterval={FULL_ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={localStyles.flatListContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={isWeb ? { overflowX: 'hidden' } : {}}
          getItemLayout={(_, index) => ({
            length: FULL_ITEM_WIDTH,
            offset: FULL_ITEM_WIDTH * index,
            index,
          })}
          extraData={CARD_WIDTH}
        />
        {isWeb && (
          <IconButton
            icon="chevron-right"
            mode="contained-tonal"
            disabled={currentIndex === data.length - 1}
            onPress={() => scrollToIndex(currentIndex + 1)}
            style={[localStyles.navButton, localStyles.rightButton]}
            containerColor={AppColors.surface}
          />
        )}
      </View>
      {/* Paginación condicional */}
      {data.length > 1 && (
        <View style={localStyles.pagination}>
          {data.map((_, index) => {
            const isSelected = currentIndex === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToIndex(index)}
                activeOpacity={0.7}
                style={localStyles.dotTouchTarget}
              >
                {/* Solo mostrar "+" si es el índice 0 y hay botón de añadir */}
                {addProp && index === 0 ? (
                  <View style={localStyles.plusDotContainer}>
                    <Text
                      style={[
                        localStyles.plusIcon,
                        { color: isSelected ? AppColors.primary : AppColors.placeholder },
                      ]}
                    >
                      +
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      localStyles.dot,
                      { backgroundColor: isSelected ? AppColors.primary : AppColors.placeholder },
                      isSelected && localStyles.activeDot,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default BotCarousel;