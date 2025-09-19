// Subjects and Topics data for question selection
export interface SubjectData {
  [key: string]: {
    name: string;
    topics: string[];
  };
}

export const SUBJECTS_DATA: SubjectData = {
  'x-english': {
    name: 'English',
    topics: [
      'A Letter to God',
      'Nelson Mandela - Long Walk to Freedom',
      'Stories About Flying',
      'From the Diary of Anne Frank',
      'Glimpses of India',
      'Mijbil the Otter',
      'Madam Rides the Bus',
      'The Sermon at Benares',
      'The Proposal',
      'Dust of Snow',
      'Fire and Ice',
      'A Tiger in the Zoo',
      'How to Tell Wild Animals',
      'The Ball Poem',
      'Amanda!',
      'The Trees',
      'Fog',
      'The Tale of Custard the Dragon',
      'For Anne Gregory',
      'A Triumph of Surgery',
      'The Thief\'s Story',
      'The Midnight Visitor',
      'A Question of Trust',
      'Footprints Without Feet',
      'The Making of a Scientist',
      'The Necklace',
      'Bholi',
      'The Book that Saved the Earth'
    ]
  },
  'x-mathematics': {
    name: 'Mathematics',
    topics: [
      'Real Numbers',
      'Polynomials',
      'Pair of Linear Equations in Two Variables',
      'Quadratic Equations',
      'Arithmetic Progressions',
      'Triangles',
      'Coordinate Geometry',
      'Introduction to Trigonometry',
      'Some Applications of Trigonometry',
      'Circles',
      'Constructions',
      'Areas Related to Circles',
      'Surface Areas and Volumes',
      'Statistics',
      'Probability'
    ]
  },
  'x-science': {
    name: 'Science',
    topics: [
      'chemical-reactions-and-equations',
      'acids-bases-and-salts', 
      'metals-and-non-metals', 
      'carbon-and-its-compounds',
      'life-processes',
      'control-and-coordination',
      'how-do-organisms-reproduce',
      'heredity',
      'light-reflection-and-refraction', 
      'the-human-eye-and-the-colourful-world',
      'electricity',
      'magnetic-effects-of-electric-current',
      'our-environment'
    ]
  },
  'x-social-science': {
    name: 'Social Science',
    topics: [
      'The Rise of Nationalism in Europe',
      'Nationalism in India',
      'The Making of a Global World',
      'Print Culture and the Modern World',
      'Power Sharing',
      'Federalism',
      'Gender Religion and Caste',
      'Political Parties',
      'Outcomes of Democracy',
      'Resources and Development',
      'Forest and Wildlife Resources',
      'Water Resources',
      'Agriculture',
      'Mineral and Energy Resources',
      'Manufacturing Industries',
      'Development',
      'Sectors of Indian Economy',
      'Money and Credit',
      'Globalisation and Indian Economy'
    ]
  },
  'x-hindi': {
    name: 'Hindi',
    topics: [
      'Surdas',
      'Tulsidas',
      'Jayashankar Prasad',
      'Suryakant Tripathi \'Nirala\'',
      'Nagarjun',
      'Manglesh Dabral',
      'Saviya Prakash',
      'Ram Vriksh Benipuri',
      'Yashpal',
      'Manu Bhandari',
      'Yatindra Mishra',
      'Bhaddant Anand Kausalyayan',
      'Mata Ka Anchal',
      'Sana Sana Hath Jodi',
      'Mein Kyon Likhata Hun'
    ]
  }
};

// Helper function to get subject options for dropdown
export const getSubjectOptions = () => {
  return Object.entries(SUBJECTS_DATA).map(([code, data]) => ({
    value: code,
    label: data.name,
    code: code
  }));
};

// Helper function to get topics for a specific subject
export const getTopicsForSubject = (subjectCode: string): string[] => {
  return SUBJECTS_DATA[subjectCode]?.topics || [];
};

// Helper function to get subject name from code
export const getSubjectName = (subjectCode: string): string => {
  return SUBJECTS_DATA[subjectCode]?.name || subjectCode;
};
