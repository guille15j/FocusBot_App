import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  useColorScheme,
  StyleSheet
} from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import BotCard from './BotCard';

const BotCarousel = ({ bots = [], onAddPress, onIndexChange, addProp = false }) => {
  const scheme = useColorScheme();
  const AppColors = useMemo(() => getColors(scheme), [scheme]);
  const { width: windowWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Configuración de dimensiones
  const CARD_WIDTH = isWeb ? windowWidth * 0.5 : windowWidth * 0.85;
  const SPACING = 10;
  const FULL_ITEM_WIDTH = CARD_WIDTH + SPACING;

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const data = useMemo(() => {
    const safeBots = Array.isArray(bots) ? bots : [];
    if (safeBots.length === 0 && !addProp) {
      return [{ isEmpty: true }];
    }
    return addProp ? [{ isAddButton: true }, ...safeBots] : safeBots;
  }, [bots, addProp]);

  //osicionamiento inicial
  useEffect(() => {
    // Si hay botón de añadir (idx 0) y hay al menos un bot (idx 1)
    if (addProp && data.length > 1) {

      scrollToIndex(1);

    }
  }, [addProp]);

  // NOtificar del indez para poder manejar el id del bot para la selccion
  useEffect(() => {
    if (onIndexChange && data[currentIndex] && !data[currentIndex].isEmpty && !data[currentIndex].isAddButton) {
      onIndexChange(data[currentIndex]);
    }
  }, [currentIndex, data, onIndexChange]);

  const scrollToIndex = (index) => {
    if (flatListRef.current && index >= 0 && index < data.length) {
      flatListRef.current.scrollToOffset({
        offset: index * FULL_ITEM_WIDTH,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item }) => {
    // Si no hay datos
    if (item.isEmpty) {
      return (
        <View style={{ width: FULL_ITEM_WIDTH, alignItems: 'center' }}>
          <View style={localStyles.cardContainer}>
            <Surface style={[localStyles.card, localStyles.emptyCard, { backgroundColor: AppColors.surface }]}>
              <IconButton icon="robot-off" size={40} iconColor={AppColors.placeholder} />
              <Text style={{ color: AppColors.placeholder, textAlign: 'center', paddingHorizontal: 20 }}>
                No tienes ningún FocusBot vinculado todavía.
              </Text>
            </Surface>
          </View>
        </View>
      );
    }

    // Si tenemos que meter el botnn de add
    if (item.isAddButton) {
      return (
        <View style={{ width: FULL_ITEM_WIDTH, alignItems: 'center' }}>
          <TouchableOpacity style={[localStyles.cardContainer, { justifyContent: 'center'}]} onPress={onAddPress}>
            <Surface style={[localStyles.card, localStyles.addCard, { backgroundColor: AppColors.surface }]}>
              <IconButton icon="plus" size={40} iconColor={AppColors.primary} />
              <Text style={{ color: AppColors.primary, fontWeight: 'bold' }}>Vincular Bot</Text>
            </Surface>
          </TouchableOpacity>
        </View>
      );
    }

    // card del bot
    return (
      <View style={{ width: FULL_ITEM_WIDTH, alignItems: 'center', }}>
        <View style={[localStyles.cardContainer, { justifyContent: 'center'}]}>
          <BotCard item={item} AppColors={AppColors} onClick={() => {}} />
        </View>
      </View>
    );
  };

  const localStyles = StyleSheet.create({
    mainWrapper: { marginVertical: 10, width: '100%' },
    carouselContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    cardContainer: { width: CARD_WIDTH, height: 180, marginHorizontal: 10, },
    card: { flex: 0, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    addCard: { padding: 25, width: 200, alignSelf: 'center', borderRadius: 32},
    emptyCard: { borderStyle: 'dotted', borderWidth: 1, borderColor: AppColors.placeholder, opacity: 0.8 },
    arrowButton: { position: 'absolute', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.1)' },
    leftArrow: { left: 10 },
    rightArrow: { right: 10 },
    pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 0 },
    dotTouchTarget: { paddingTop: 8 ,paddingHorizontal: 2},
    dot: { width: 10, height: 10, borderRadius: 4, marginHorizontal: 4 },
    plusDotContainer: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    plusIcon: { fontSize: 18, fontWeight: 'bold', marginTop: -2 }
  });

  return (
    <View style={localStyles.mainWrapper}>
      <View style={localStyles.carouselContainer}>
        {/* botones para web */}
        {isWeb && currentIndex > 0 && (
          <IconButton
            icon="chevron-left"
            style={[localStyles.arrowButton, localStyles.leftArrow]}
            onPress={() => scrollToIndex(currentIndex - 1)}
          />
        )}

        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(_, index) => `item-${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={FULL_ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: (windowWidth - FULL_ITEM_WIDTH) / 2 }}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / FULL_ITEM_WIDTH);
            if (index >= 0 && index < data.length) setCurrentIndex(index);
          }}
        />

        {/* botones para web */}
        {isWeb && currentIndex < data.length - 1 && (
          <IconButton
            icon="chevron-right"
            style={[localStyles.arrowButton, localStyles.rightArrow]}
            onPress={() => scrollToIndex(currentIndex + 1)}
          />
        )}
      </View>

      {/* Paginación de las cards de bot interactivos para mejor navegacion*/}
      {data.length > 1 && !data[0].isEmpty && (
        <View style={localStyles.pagination}>
          {data.map((_, index) => {
            const isSelected = currentIndex === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToIndex(index)}
                style={localStyles.dotTouchTarget}
              >
                {addProp && index === 0 ? (
                  <View style={localStyles.plusDotContainer}>
                    <Text style={[localStyles.plusIcon, { color: isSelected ? AppColors.primary : AppColors.placeholder }]}>+</Text>
                  </View>
                ) : (
                  <View style={[localStyles.dot, { backgroundColor: isSelected ? AppColors.primary : AppColors.placeholder }]} />
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