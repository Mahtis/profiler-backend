const sharp = require('sharp')
const uuidv1 = require('uuid/v1')
const fs = require('fs')

const PUBLIC_PICTURE_PATH = 'img/profiles/'
const PUBLIC_THUMBNAIL_PATH = 'img/thumbnails/'
const PROFILE_WIDTH = 500
const PROFILE_HEIGHT = 600
const THUMB_WIDTH = 200

// const createProfilePicture = async (imgPath) => {
//   const img = fs.readFileSync(imgPath)
//   const imgName = `profile_${uuidv1()}.jpg`
//   const path = 'public/img/profiles/'
//   await sharp(img)
//     .resize(500, 600)
//     .crop()
//     .toFile(path + imgName)
//   return `img/profiles/${imgName}`
// }

// const createProfileThumbnail = async img => {
//   // const img = fs.readFileSync(`public/img/profiles/profile${imgName}.jpg`)
//   // const thumbName = `public/img/thumbnails/thumb_${imgName}.jpg`
//   const thumb = await sharp(img)
//     .resize(200, 200)
//     .crop()
//     .toFile(thumbName)
//   return `img/thumbnails/thumb_${imgName}.jpg`
// }

const cropImageFromPath = (imgPath, imgName, width, height, pubPath) => {
  const img = fs.readFileSync(imgPath)
  return cropImage(img, imgName, width, height, pubPath)
}

const cropImage = async (img, imgName, width, height, pubPath) => {
  const path = `public/${pubPath}`
  await sharp(img)
    .resize(width, height)
    .crop()
    .toFile(path + imgName)
    .then(res => res, error => console.log('I cant do it!', error))
  return `${pubPath}/${imgName}`
}

const createProfilePictureAndThumbnail = async (imgPath) => {
  const imgName = `profile_${uuidv1()}.jpg`
  const thumbName = `thumb_${uuidv1()}.jpg`
  const profileImg = await cropImageFromPath(imgPath, imgName, PROFILE_WIDTH, PROFILE_HEIGHT, PUBLIC_PICTURE_PATH)
  const thumbImg = await cropImageFromPath(`public/${profileImg}`, thumbName, THUMB_WIDTH, THUMB_WIDTH, PUBLIC_THUMBNAIL_PATH)
  return {
    picture: profileImg,
    thumbnail: thumbImg
  }
}

module.exports = { createProfilePictureAndThumbnail }