export const samplePhoto = {
  id: 1,
  title: 'Sample Photo',
  albumId: 1,
};

export const sampleAlbum = {
  id: 1,
  title: 'Sample Album',
  userId: 1,
};

export const sampleUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

export const enrichedSamplePhoto = {
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
    },
  },
};
