export interface Survey {
  id: string;
  interviewer: string;
  date: string;
  location: string;
  questions: string[];
  answers: string[][];  // Now an array of answer arrays
  nostrPubkey: string;
}

export const mockData: Survey[] = [
  {
    id: '1',
    interviewer: 'Emilia',
    date: '2024-03-15',
    location: 'Acate-Florianopolis',
    questions: [
      'Are you a local or tourist?',
      'Do you have bitcoin?'
    ],
    answers: [
      ['Local', 'Tourist', 'Local', 'Tourist', 'Local'],
      ['No', 'No', 'Yes', 'No', 'No']
    ],
    nostrPubkey: 'npub1...'
  },
  {
    id: '2',
    interviewer: 'Panda',
    date: '2024-03-15',
    location: 'Santo Antonio de Lisboa-Florianopolis',
    questions: [
      'Are you a local or a tourist?',
      'From zero to ten, how much do you know about bitcoin?',
      'From zero to ten how important do you think financial education is to young people?'
    ],
    answers: [
      ['Local', 'Tourist', 'Local', 'Local'],
      ['2', '0', '5', '3'],
      ['10', '8', '10', '9']
    ],
    nostrPubkey: 'npub2...'
  },
  {
    id: '3',
    interviewer: 'Erika',
    date: '2024-03-15',
    location: 'Santo Antonio de Lisboa-Florianopolis',
    questions: [
      'Are you a local or a tourist?',
      'From zero to ten, how much do you know about bitcoin?',
      'From zero to ten how important do you think financial education is to young people?'
    ],
    answers: [
      ['Tourist', 'Tourist', 'Local', 'Local', 'Tourist'],
      ['1', '0', '4', '2', '3'],
      ['10', '9', '10', '8', '10']
    ],
    nostrPubkey: 'npub3...'
  }
];