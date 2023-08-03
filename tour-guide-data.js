export const locations = [
    {
      name: 'Tech Tower',
      description: 'Georgia Tech\'s administration building',
      // Other location data...
    },
    {
      name: 'Location 2',
      description: 'Description of Location 2',
      // Other location data...
    },
    // Add more locations as needed...
  ]
  
  export const getTourGuideMessages = (locationIndex) => {
    // Return an array of tour guide messages or facts about the specified location
    const location = locations[locationIndex]
    if (typeof location === 'undefined') {
      // Return default messages
    //   return [
    //     'Welcome to the virtual tour guide app!',
    //     'Explore this virtual location and enjoy the experience!',
    //   ]
    // }
      return [
      // `Welcome to ${location.name}!`,
      // location.description,
        'If this was the previous century, you may not have been able to see the T on top of the tower',
        'In 1969 a group of frat brothers stole the T to commemerate the current president\'s retirement',
        'This led to a 30 year long tradition where student repeatedly stole the T',
        'Since this is now banned, you will see almost no T\'s on signs on campus',
        'whistle',
        'Pro-tip: going to the library from the back of the tower can eliminate the need to climb freshman hill!',
        '<--- travel this way to the library (CULC 2nd floor is an underrated spot)',
      ]
    }
  }
  