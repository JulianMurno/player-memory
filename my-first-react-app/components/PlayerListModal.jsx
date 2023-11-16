// PlayerListModalContent.jsx
import React from 'react';
import { Card, CardHeader, CardBody, Divider, Image, Chip } from "@nextui-org/react";
import styles from '../src/PlayerModal.module.css'; // Importa el archivo de estilos de Tailwind

const PlayerListModalContent = ({ players }) => {
  return (
    <div className='my-2.5'>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <Card className="max-w-[400px] mt-1.5 mb-1.5">
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={80}
                  radius="sm"
                  src={player.image}
                  width={80}
                />
                <div className="flex flex-col">
                  <p className="text-md"><b>{player.name}</b></p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>Equipo: {player.team}</p>
                <div className={styles[getPositionColorClass(player.position)]}>
                  <p>Posicion: <Chip> {player.position}</Chip></p>
                </div>
              </CardBody>
              <Divider />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getPositionColorClass = (position) => {
  switch (position) {
    case 'POR':
      return 'bg-yellow-400';
    case 'DEF':
      return 'bg-blue-500';
    case 'MED':
      return 'bg-green-500';
    case 'DEL':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default PlayerListModalContent;
