import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Globe, CheckCircle, XCircle } from 'lucide-react';
import countries from './capitals.json';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8;
  font-family: 'Roboto', sans-serif;
`;

const GameContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 90%;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Question = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const OptionButton = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Score = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  font-weight: bold;
`;

const Message = styled.p<{ $correct: boolean }>`
  color: ${props => props.$correct ? '#27ae60' : '#e74c3c'};
  font-weight: bold;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const NextButton = styled(OptionButton)`
  margin-top: 1rem;
  background-color: #2ecc71;

  &:hover {
    background-color: #27ae60;
  }
`;

function App() {
  const [currentCountry, setCurrentCountry] = useState<{ country: string; capital: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const getRandomCountry = () => {
    const continents = Object.keys(countries);
    const randomContinent = continents[Math.floor(Math.random() * continents.length)];
    const countriesInContinent = Object.values(countries[randomContinent as keyof typeof countries]);
    return countriesInContinent[Math.floor(Math.random() * countriesInContinent.length)];
  };

  const generateOptions = (correctCapital: string) => {
    const allCapitals = Object.values(countries).flatMap(continent => 
      Object.values(continent).map(country => country.capital)
    );
    const incorrectOptions = allCapitals.filter(capital => capital !== correctCapital);
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledIncorrect, correctCapital].sort(() => 0.5 - Math.random());
  };

  const setNewQuestion = () => {
    const newCountry = getRandomCountry();
    setCurrentCountry(newCountry);
    setOptions(generateOptions(newCountry.capital));
    setShowNext(false);
    setMessage('');
  };

  useEffect(() => {
    setNewQuestion();
  }, []);

  const handleAnswer = (selectedCapital: string) => {
    if (currentCountry) {
      const correct = selectedCapital === currentCountry.capital;
      setIsCorrect(correct);
      if (correct) {
        setScore(score + 1);
        setMessage('¡Correcto!');
      } else {
        setMessage(`Incorrecto. La capital de ${currentCountry.country} es ${currentCountry.capital}.`);
      }
      setShowNext(true);
    }
  };

  return (
    <AppContainer>
      <GameContainer>
        <Globe size={48} color="#3498db" />
        <Title>Juego de Capitales</Title>
        {currentCountry && (
          <>
            <Question>¿Cuál es la capital de {currentCountry.country}?</Question>
            <OptionsContainer>
              {options.map((option, index) => (
                <OptionButton key={index} onClick={() => handleAnswer(option)} disabled={showNext}>
                  {option}
                </OptionButton>
              ))}
            </OptionsContainer>
          </>
        )}
        <Score>Puntuación: {score}</Score>
        {message && (
          <Message $correct={isCorrect}>
            {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {message}
          </Message>
        )}
        {showNext && <NextButton onClick={setNewQuestion}>Siguiente Pregunta</NextButton>}
      </GameContainer>
    </AppContainer>
  );
}

export default App;