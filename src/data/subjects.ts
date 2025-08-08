// Subjects and Topics data for question selection
export interface SubjectData {
  [key: string]: {
    name: string;
    topics: string[];
  };
}

export const SUBJECTS_DATA: SubjectData = {
  'x_english': {
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
  'x_mathematics': {
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
  'x_science': {
    name: 'Science',
    topics: [
      'Chemical Reactions and Equations Solutions',
      'Acids, Bases and Salts Solutions',
      'Metals and Non Metals Solutions',
      'Carbon and Its Compounds Solutions',
      'Life Processes Solutions',
      'Control And Coordination Solutions',
      'How do Organisms Reproduce Solutions',
      'Heredity and Evolution Solutions',
      'Light Reflection and Refraction Solutions',
      'The Human Eye and the Colourful World Solutions',
      'Electricity Solutions',
      'Magnetic Effects of Electric Current Solutions',
      'Our Environment Solutions'
    ]
  },
  'x_social_science': {
    name: 'Social Science',
    topics: [
      'The Rise of Nationalism in Europe',
      'Nationalism in India',
      'The Making of a Global World',
      'Print Culture and the Modern World',
      'Power-sharing',
      'Federalism',
      'Gender, Religion and Caste',
      'Political Parties',
      'Outcomes of Democracy',
      'Resources and Development',
      'Forest and Wildlife Resources',
      'Water Resources',
      'Agriculture',
      'Mineral and Energy Resources',
      'Manufacturing Industries',
      'Lifelines of National Economy',
      'Development',
      'Sectors of the Indian Economy',
      'Money and Credit',
      'Globalisation and the Indian Economy'
    ]
  },
  'x_hindi': {
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