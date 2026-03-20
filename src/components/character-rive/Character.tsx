import {
    RiveView,
    useRive,
    useRiveFile,
    useRiveNumber,
    useRiveTrigger,
    useViewModelInstance,
    Fit,
    useRiveBoolean,
    DataBindMode,
    useRiveString,
  } from '@rive-app/react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Entity } from '@engine';
import { useEffect } from 'react';

interface CharacterProps {
    characterEntity: Entity | undefined;
  }
  

export const Character = ({characterEntity}: CharacterProps) =>  {
    const { riveFile } = useRiveFile(
        require('./character_set_piece.riv')
      );

      const { riveViewRef, setHybridRef } = useRive();
      const instance = useViewModelInstance(riveFile);

      const { value: userName, setValue: setUserName, error: stringError } = useRiveString(
        'sentence',
        instance
    );
    
      return (
        <View style={styles.container}>
          {riveFile && instance &&  <RiveView file={riveFile}
          hybridRef={setHybridRef}
          style={styles.rive}
          artboardName='Mouth'
          dataBind={instance}

          />}
          <Pressable onPress={() => setUserName("helllooooo")}>
            <View style={{width: 40, height: 40, backgroundColor: 'red'}}/>
          </Pressable>
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rive: {
      width: '100%',
      height: 400,
    },
  });