export const testOutputImage = {
  emtyImages: {
    wallpaper: null,
    main: [],
  },
  afterWallpaperLoad: {
    wallpaper: {
      url: expect.any(String),
      width: 1028,
      height: 312,
      fileSize: expect.any(Number),
    },
    main: [],
  },
  afterWallpaperAndMainLoad: {
    wallpaper: {
      url: expect.any(String),
      width: 1028,
      height: 312,
      fileSize: expect.any(Number),
    },
    main: [
      {
        url: expect.any(String),
        width: 156,
        height: 156,
        fileSize: expect.any(Number),
      },
    ],
  },
};
