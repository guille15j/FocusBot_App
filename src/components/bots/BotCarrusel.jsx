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

  // Configuración de dimensiones calculadas con precisión
  const CARD_WIDTH = isWeb ? windowWidth * 0.5 : windowWidth * 0.82;
  const SPACING = 12; // Separación exacta entre elementos
  const FULL_ITEM_WIDTH = CARD_WIDTH + SPACING;
  
  // Padding lateral necesario para centrar la primera y última tarjeta de forma exacta
  const CENTER_PADDING = (windowWidth - FULL_ITEM_WIDTH) / 2;

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const data = useMemo(() => {
    const safeBots = Array.isArray(bots) ? bots : [];
    if (safeBots.length === 0 && !addProp) {
      return [{ isEmpty: true }];
    }
    return addProp ? [{ isAddButton: true }, ...safeBots] : safeBots;
  }, [bots, addProp]);

  // Posicionamiento inicial al índice 1 si el addProp está activo y hay elementos
  useEffect(() => {
    if (addProp && data.length > 1) {
      // Un pequeño delay garantiza que FlatList esté renderizado en el árbol nativo antes de desplazarlo
      const timer = setTimeout(() => {
        scrollToIndex(1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setCurrentIndex(0);
    }
  }, [addProp, data.length]);

  // Notificar el índice activo para manejar la selección del bot exterior
  useEffect(() => {
    if (onIndexChange && data[currentIndex] && !data[currentIndex].isEmpty && !data[currentIndex].isAddButton) {
      onIndexChange(data[currentIndex]);
    }
  }, [currentIndex, data, onIndexChange]);

  const scrollToIndex = (index) => {
    if (flatListRef.current && index >= 0 && index < data.length) {
      // Al usar snapToAlignment="center", el cálculo del offset se simplifica matemáticamente
      const offset = index * FULL_ITEM_WIDTH;
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item }) => {
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

    if (item.isAddButton) {
      return (
        <View style={{ width: FULL_ITEM_WIDTH, alignItems: 'center' }}>
          <TouchableOpacity style={localStyles.cardContainer} onPress={onAddPress} activeOpacity={0.9}>
            <Surface style={[localStyles.card, localStyles.addCard, { backgroundColor: AppColors.surface }]}>
              <IconButton icon="plus" size={40} iconColor={AppColors.primary} />
              <Text style={{ color: AppColors.primary, fontWeight: 'bold' }}>Vincular Bot</Text>
            </Surface>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ width: FULL_ITEM_WIDTH, alignItems: 'center' }}>
        <View style={localStyles.cardContainer}>
          <BotCard item={item} AppColors={AppColors} onClick={() => {}} />
        </View>
      </View>
    );
  };

  const localStyles = StyleSheet.create({
    mainWrapper: { 
      marginVertical: 10, 
      width: '100%' 
    },
    carouselContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative'
    },
    cardContainer: { 
      width: CARD_WIDTH, 
      height: 180,
      justifyContent: 'center',
    },
    card: { 
      flex: 1, 
      borderRadius: 20, 
      justifyContent: 'center', 
      alignItems: 'center', 
      elevation: 2 
    },
    addCard: { 
      padding: 25, 
      borderRadius: 32,
      borderWidth: 1,
      borderColor: AppColors.primary + '30'
    },
    emptyCard: { 
      borderStyle: 'dotted', 
      borderWidth: 1, 
      borderColor: AppColors.placeholder, 
      opacity: 0.8 
    },
    arrowButton: { 
      position: 'absolute', 
      zIndex: 10, 
      backgroundColor: 'rgba(0,0,0,0.1)' 
    },
    leftArrow: { left: 10 },
    rightArrow: { right: 10 },
    pagination: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginTop: 12 
    },
    dotTouchTarget: { 
      paddingTop: 8,
      paddingHorizontal: 4
    },
    dot: { 
      width: 8, 
      height: 8, 
      borderRadius: 4 
    },
    plusDotContainer: { 
      width: 16, 
      height: 16, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginTop: -4
    },
    plusIcon: { 
      fontSize: 14, 
      fontWeight: 'bold' 
    }
  });

  return (
    <View style={localStyles.mainWrapper}>
      <View style={localStyles.carouselContainer}>
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
          keyExtractor={(_, index) => `bot-item-${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={FULL_ITEM_WIDTH}
          snapToAlignment="center"
          decelerationRate="fast"
          contentInset={{ left: CENTER_PADDING, right: CENTER_PADDING }}
          contentContainerStyle={{ 
            paddingHorizontal: Platform.OS === 'android' || isWeb ? CENTER_PADDING : 0 
          }}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / FULL_ITEM_WIDTH);
            if (index >= 0 && index < data.length) setCurrentIndex(index);
          }}
        />

        {isWeb && currentIndex < data.length - 1 && (
          <IconButton
            icon="chevron-right"
            style={[localStyles.arrowButton, localStyles.rightArrow]}
            onPress={() => scrollToIndex(currentIndex + 1)}
          />
        )}
      </View>

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
                    <Text style={[localStyles.plusIcon, { color: isSelected ? AppColors.primary : AppColors.placeholder }]}>
                      +
                    </Text>
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