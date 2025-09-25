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
      'a-letter-to-god',
      'long-walk-to-freedom',
      'his-first-flight',
      'a-baker-from-goa',
      'a-shady-plot',
      'a-tiger-in-the-zoo',
      'coorg',
      'creative-writing',
      'dust-of-snow',
      'fire-and-ice',
      'from-the-diary-of-anne-frank',
      'english-grammar',
      'madam-rides-the-bus',
      'mijbil-the-otter',
      'english-reading-comprehension',
      'tea-from-assam',
      'the-proposal',
      'the-sermon-at-benaras',
      'the-trees'
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
      'nationalism-in-India',
      'federalism',
      'gender-religion-and-caste',
      'forest-and-wildlife-resources',
      'agriculture',
      'minerals-and-energy-resources',
      'manufacturing-industries',
      'development',
      'money-and-credit',
      'globalisation-and-indian-economy',
      'outcomes-of-democracy',
      'political-parties',
      'powersharing',
      'print-culture-and-the-modern-world',
      'resources-and-development',
      'sectors-of-the-indian-economy',
      'the-making-of-a-global-world',
      
      
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
