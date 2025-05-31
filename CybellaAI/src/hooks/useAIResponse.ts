import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export function useAIResponse() {
  const [aiResponse, setAiResponse] = useState<string>('');
  const [shouldPlayVoice, setShouldPlayVoice] = useState<boolean>(false);
  const [processingInput, setProcessingInput] = useState<boolean>(false);
  const { language } = useLanguage();
  const { preferences, addPreference } = useUserPreferences();
  const [conversationStage, setConversationStage] = useState<string>('initial');
  
  const [interactionCounter, setInteractionCounter] = useState<number>(0);
  
  useEffect(() => {
    if (conversationStage !== 'initial') {
      setInteractionCounter(0);
    }
  }, [conversationStage]);
  
  const generateAIResponse = (userInput: string) => {
    if (!userInput.trim()) return;

    if (userInput === "too short") {
      setAiResponse("Can you explain a bit more?");
      setShouldPlayVoice(true);
      return "Can you explain a bit more?";
    }    
    
    setAiResponse('');
    setShouldPlayVoice(false);
    setProcessingInput(true);
    
    setInteractionCounter(prev => prev + 1);
    
    const shouldCollectPreference = interactionCounter >= 2;
    
    processUserInputForPreferences(userInput.toLowerCase());
    
    const category = determineEmotionalCategory(userInput.toLowerCase());
    
    const response = generateResponseBasedOnEmotionAndPreferences(category, shouldCollectPreference);
    
    const thinkingTime = 1000 + Math.random() * 1000;
    
    const responseTimer = setTimeout(() => {
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= response.length) {
          setAiResponse(response.substring(0, currentIndex));
          currentIndex++;
          
          if (Math.random() > 0.9) {
            clearInterval(typingInterval);
            setTimeout(() => {
              const newTypingInterval = setInterval(() => {
                if (currentIndex <= response.length) {
                  setAiResponse(response.substring(0, currentIndex));
                  currentIndex++;
                } else {
                  clearInterval(newTypingInterval);
                  setProcessingInput(false);
                  setShouldPlayVoice(true);
                }
              }, 30 + Math.random() * 50);
            }, 200 + Math.random() * 300);
          }
        } else {
          clearInterval(typingInterval);
          setProcessingInput(false);
          setShouldPlayVoice(true);
        }
      }, 30 + Math.random() * 50);
    }, thinkingTime);

    return () => {
      clearTimeout(responseTimer);
    };
  };

  const processUserInputForPreferences = (input: string) => {
    if ((input.includes('like to') || input.includes('enjoy') || input.includes('hobby') || input.includes('hobbies')) && 
        !input.includes('what') && !input.includes('?')) {
      const potentialHobbies = extractPotentialPreferences(input);
      if (potentialHobbies.length > 0) {
        potentialHobbies.forEach(hobby => {
          if (hobby.length > 2) {
            addPreference('hobbies', hobby.trim());
          }
        });
      }
    }
    
    if ((input.includes('favorite place') || input.includes('like to go') || input.includes('love to visit')) && 
        !input.includes('what') && !input.includes('?')) {
      const potentialPlaces = extractPotentialPreferences(input);
      if (potentialPlaces.length > 0) {
        potentialPlaces.forEach(place => {
          if (place.length > 2) {
            addPreference('favoritePlaces', place.trim());
          }
        });
      }
    }
    
    if ((input.includes('game') || input.includes('play')) && 
        !input.includes('what') && !input.includes('?')) {
      const potentialGames = extractPotentialPreferences(input);
      if (potentialGames.length > 0) {
        potentialGames.forEach(game => {
          if (game.length > 2) {
            addPreference('favoriteGames', game.trim());
          }
        });
      }
    }
    
    if ((input.includes('friend') || input.includes('best friend')) && 
        !input.includes('what') && !input.includes('?')) {
      const potentialFriends = extractPotentialPreferences(input);
      if (potentialFriends.length > 0) {
        potentialFriends.forEach(friend => {
          if (friend.length > 2) {
            addPreference('bestFriends', friend.trim());
          }
        });
      }
    }
    
    if ((input.includes('food') || input.includes('eat') || input.includes('favorite meal')) && 
        !input.includes('what') && !input.includes('?')) {
      const potentialFoods = extractPotentialPreferences(input);
      if (potentialFoods.length > 0) {
        potentialFoods.forEach(food => {
          if (food.length > 2) {
            addPreference('favoriteFood', food.trim());
          }
        });
      }
    }
  };

  const extractPotentialPreferences = (input: string): string[] => {
    const words = input.split(/\s+/);
    const importantWords = words.filter(word => 
      word.length > 3 && 
      !['like', 'enjoy', 'favorite', 'love', 'hobby', 'hobbies', 'place', 'game', 'play', 'friend'].includes(word)
    );
    
    return importantWords;
  };

  const determineEmotionalCategory = (input: string): string => {
    if (input.includes('anxious') || input.includes('anxiety') || input.includes('worried') || 
        input.includes('panic') || input.includes('ansie') || input.includes('ansiedad') || 
        input.includes('anxiété')) {
      return 'anxiety';
    } else if (input.includes('depress') || input.includes('sad') || input.includes('hopeless') || 
               input.includes('meaningless') || input.includes('triste') || input.includes('déprimé')) {
      return 'depression';
    } else if (input.includes('stress') || input.includes('overwhelm') || input.includes('too much') || 
               input.includes('pressure') || input.includes('presión') || input.includes('pression')) {
      return 'stress';
    }
    return 'general';
  };

  const generateResponseBasedOnEmotionAndPreferences = (category: string, shouldCollectPreference: boolean): string => {
    const therapeuticResponses: Record<string, Record<string, string[]>> = {
      en: {
        anxiety: [
          "I notice you're feeling anxious. Would you like to talk more about what's causing that feeling?",
          "Anxiety can be tough to deal with. What helps you feel calmer when you're anxious?",
          "I'm hearing some anxiety in your voice. Let's take a deep breath together first, and then you can tell me more."
        ],
        depression: [
          "It sounds like you might be feeling down. I'm here to listen if you want to talk about it.",
          "Those feelings are valid. What small thing might bring you a moment of peace today?",
          "Thank you for sharing that with me. Depression can feel isolating, but you're not alone right now."
        ],
        stress: [
          "It seems like you're under a lot of pressure. What's weighing on you the most right now?",
          "I hear that you're stressed. Would talking through some of those concerns help?",
          "Let's take a moment to focus on what's happening right now. What's one thing that's in your control?"
        ],
        general: [
          "Thanks for sharing that with me. How long have you been feeling this way?",
          "I'm listening. What else is on your mind?",
          "I appreciate you opening up. Would it help to explore what might be behind those feelings?",
          "I'm glad you're talking with me about this. What do you think would help you feel better right now?"
        ],
        askHobbies: [
          "I'd like to get to know you better. What are some hobbies or activities you enjoy?",
          "What do you like to do in your free time?"
        ],
        askPlaces: [
          "Do you have any favorite places you like to visit or spend time at?",
          "Is there a special place that helps you feel relaxed when you go there?"
        ],
        askGames: [
          "Do you enjoy playing any games? Video games, board games, or sports perhaps?",
          "What games do you find most enjoyable or relaxing?"
        ],
        askFriends: [
          "Do you have close friends you like to spend time with?",
          "Who's someone that always manages to cheer you up when you're feeling down?"
        ],
        askFood: [
          "What kinds of food do you enjoy the most?",
          "Do you have any comfort foods that help when you're not feeling your best?"
        ]
      },
      es: {
        anxiety: [
          "Noto que te sientes ansioso. ¿Te gustaría hablar más sobre qué está causando ese sentimiento?",
          "La ansiedad puede ser difícil de manejar. ¿Qué te ayuda a sentirte más tranquilo cuando estás ansioso?",
          "Escucho algo de ansiedad en tu voz. Respiremos profundo juntos primero, y luego me puedes contar más."
        ],
        depression: [
          "Parece que podrías estar sintiéndote triste. Estoy aquí para escucharte si quieres hablar de ello.",
          "Esos sentimientos son válidos. ¿Qué pequeña cosa podría traerte un momento de paz hoy?",
          "Gracias por compartir eso conmigo. La depresión puede sentirse aislante, pero no estás solo en este momento."
        ],
        stress: [
          "Parece que estás bajo mucha presión. ¿Qué es lo que más te pesa en este momento?",
          "Escucho que estás estresado. ¿Te ayudaría hablar sobre algunas de esas preocupaciones?",
          "Tomemos un momento para concentrarnos en lo que está sucediendo ahora. ¿Qué es algo que está bajo tu control?"
        ],
        general: [
          "Gracias por compartir eso conmigo. ¿Cuánto tiempo has estado sintiéndote así?",
          "Te escucho. ¿Qué más tienes en mente?",
          "Agradezco que te abras. ¿Ayudaría explorar qué podría estar detrás de esos sentimientos?",
          "Me alegra que estés hablando conmigo sobre esto. ¿Qué crees que te ayudaría a sentirte mejor ahora mismo?"
        ],
        askHobbies: [
          "Me gustaría conocerte mejor. ¿Cuáles son algunos pasatiempos o actividades que disfrutas?",
          "¿Qué te gusta hacer en tu tiempo libre?"
        ],
        askPlaces: [
          "¿Tienes lugares favoritos que te gusta visitar o donde pasar el tiempo?",
          "¿Hay algún lugar especial que te ayude a sentirte relajado cuando vas allí?"
        ],
        askGames: [
          "¿Disfrutas jugando algún juego? ¿Videojuegos, juegos de mesa o deportes quizás?",
          "¿Qué juegos encuentras más agradables o relajantes?"
        ],
        askFriends: [
          "¿Tienes amigos cercanos con los que te gusta pasar el tiempo?",
          "¿Quién es alguien que siempre logra animarte cuando te sientes mal?"
        ],
        askFood: [
          "¿Qué tipos de comida disfrutas más?",
          "¿Tienes alguna comida reconfortante que te ayude cuando no te sientes bien?"
        ]
      },
      fr: {
        anxiety: [
          "Je remarque que vous vous sentez anxieux. Aimeriez-vous parler davantage de ce qui cause ce sentiment?",
          "L'anxiété peut être difficile à gérer. Qu'est-ce qui vous aide à vous sentir plus calme quand vous êtes anxieux?",
          "J'entends de l'anxiété dans votre voix. Respirons profondément ensemble d'abord, puis vous pourrez m'en dire plus."
        ],
        depression: [
          "Il semble que vous vous sentez déprimé. Je suis là pour vous écouter si vous voulez en parler.",
          "Ces sentiments sont valides. Quelle petite chose pourrait vous apporter un moment de paix aujourd'hui?",
          "Merci de partager cela avec moi. La dépression peut sembler isolante, mais vous n'êtes pas seul en ce moment."
        ],
        stress: [
          "Il semble que vous êtes sous beaucoup de pression. Qu'est-ce qui vous pèse le plus en ce moment?",
          "J'entends que vous êtes stressé. Est-ce que parler de certaines de ces préoccupations aiderait?",
          "Prenons un moment pour nous concentrer sur ce qui se passe maintenant. Quelle est une chose qui est sous votre contrôle?"
        ],
        general: [
          "Merci de partager cela avec moi. Depuis combien de temps vous sentez-vous ainsi?",
          "Je vous écoute. Quoi d'autre avez-vous à l'esprit?",
          "J'apprécie que vous vous ouvriez. Serait-il utile d'explorer ce qui pourrait être derrière ces sentiments?",
          "Je suis heureux que vous me parliez de cela. Qu'est-ce qui, selon vous, pourrait vous aider à vous sentir mieux maintenant?"
        ],
        askHobbies: [
          "J'aimerais mieux te connaître. Quels sont tes loisirs ou activités que tu aimes?",
          "Qu'aimes-tu faire pendant ton temps libre?"
        ],
        askPlaces: [
          "As-tu des endroits préférés que tu aimes visiter ou où passer du temps?",
          "Y a-t-il un endroit spécial qui t'aide à te sentir détendu quand tu y vas?"
        ],
        askGames: [
          "Aimes-tu jouer à des jeux? Jeux vidéo, jeux de société ou sports peut-être?",
          "Quels jeux trouves-tu les plus agréables ou relaxants?"
        ],
        askFriends: [
          "As-tu des amis proches avec qui tu aimes passer du temps?",
          "Qui est quelqu'un qui toujours logre à te remonter le moral quand tu ne te sens pas bien?"
        ],
        askFood: [
          "Quels types de nourriture aimes-tu le plus?",
          "As-tu des plats réconfortants qui t'aident quand tu ne te sens pas au mieux?"
        ]
      }
    };
    
    const currentLanguage = therapeuticResponses[language] ? language : 'en';
    const responses = therapeuticResponses[currentLanguage];
    
    if (shouldCollectPreference) {
      if (preferences.hobbies.length === 0) {
        return responses.askHobbies[Math.floor(Math.random() * responses.askHobbies.length)];
      } else if (preferences.favoritePlaces.length === 0) {
        return responses.askPlaces[Math.floor(Math.random() * responses.askPlaces.length)];
      } else if (preferences.favoriteGames.length === 0) {
        return responses.askGames[Math.floor(Math.random() * responses.askGames.length)];
      } else if (preferences.bestFriends.length === 0) {
        return responses.askFriends[Math.floor(Math.random() * responses.askFriends.length)];
      } else if (preferences.favoriteFood.length === 0) {
        return responses.askFood[Math.floor(Math.random() * responses.askFood.length)];
      }
    }
    
    const responseArray = responses[category] || responses.general;
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  return {
    aiResponse,
    shouldPlayVoice,
    processingInput,
    generateAIResponse,
    setAiResponse,
    setShouldPlayVoice
  };
}
