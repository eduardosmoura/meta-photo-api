export const samplePhoto = {
  id: 1,
  title: 'Sample Photo',
  url: 'http://example.com/photo.jpg',
  thumbnailUrl: 'http://example.com/thumb.jpg',
  album: {
    id: 1,
    title: 'Sample Album',
    user: {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: 'Main St',
        suite: 'Apt. 1',
        city: 'Anytown',
        zipcode: '12345',
        geo: { lat: '0.0', lng: '0.0' },
      },
      phone: '123-456-7890',
      website: 'example.com',
      company: {
        name: 'Example Inc.',
        catchPhrase: 'We deliver',
        bs: 'business stuff',
      },
    },
  },
};
