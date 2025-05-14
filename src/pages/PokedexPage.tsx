import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonLabel, IonThumbnail, IonImg, useIonAlert } from '@ionic/react';

const PokedexPage: React.FC = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      setPokemons(data.results);
    };
    fetchPokemons();
  }, []);

  useEffect(() => {
    const handleUp = () => setSelectedIndex((prev) => (prev === 0 ? pokemons.length - 1 : prev - 1));
    const handleDown = () => setSelectedIndex((prev) => (prev === pokemons.length - 1 ? 0 : prev + 1));
    const handleSelect = async () => {
      const pokemon = pokemons[selectedIndex];
      const res = await fetch(pokemon.url);
      const data = await res.json();
      presentAlert({
        header: pokemon.name,
        message: `Height: ${data.height}, Weight: ${data.weight}`,
        buttons: ['OK'],
      });
    };

    window.addEventListener('cross-up', handleUp);
    window.addEventListener('cross-down', handleDown);
    window.addEventListener('cross-select', handleSelect);

    return () => {
      window.removeEventListener('cross-up', handleUp);
      window.removeEventListener('cross-down', handleDown);
      window.removeEventListener('cross-select', handleSelect);
    };
  }, [pokemons, selectedIndex, presentAlert]);

  useEffect(() => {
    const selectedItem = document.getElementById(`pokemon-item-${selectedIndex}`);
    selectedItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <IonList style={{ padding: 0 }}>
          {pokemons.map((pokemon, index) => (
            <IonItem
              key={index}
              id={`pokemon-item-${index}`}
              color={index === selectedIndex ? 'primary' : ''}
            >
              <IonThumbnail slot="start">
                <IonImg src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`} />
              </IonThumbnail>
              <IonLabel>{pokemon.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </div>
    </div>
  );
};

export default PokedexPage;
