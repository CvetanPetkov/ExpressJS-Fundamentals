const Image = require('./models/Image')
const Tag = require('./models/Tag')

//  HELPER FUNCTIONS START

function createTag (tagName) {
  return new Promise((resolve, reject) => {
    Tag
      .findOne({name: tagName})
      .then((tagExists) => {
        if (tagExists) {
          resolve(tagExists._id)  //  returns the tag _id
          return
        }

        Tag
          .create({name: tagName})
          .then((tag) => {
            resolve(tag._id)  //crts the tag returns the _id
          })
      })
  })    //  where did the reject go - handle it?
}

function addImageToTag (tagData) {
  return new Promise((resolve, reject) => {
    Tag
      .findOne({name: tagData.name})  //  finds the tag
      .then((tag) => {
        tag.images.push(tagData.imageId)  //  pushes img_id
        tag
          .save()
          .then(() => {
            resolve(`Image "${tagData.imageId}" added to tag "${tag.name}"`)
          })
      })
  })
}    //  where did the reject go - handle it?

//  HELPER FUNCTIONS END
//  EXPORTS START

module.exports = {
  saveImage: (imageData) => {
    let image = {         //  instantiate new image to fill
      url: imageData.url,
      description: imageData.description,
      tags: []
    }

    let tags = imageData.tags  //  all funct input tags
    let addTags = []           //  here push all new tags

    for (let tag of tags) {
      addTags.push(
        createTag(tag)        //  addTags seems redundant???
          .then((tagId) => {
            image.tags.push(tagId)
            console.log(`Tag "${tag}" linked!`)
          })
      )
    }

    Promise.all(addTags)
      .then(() => {
        Image.create(image)
          .then((imageData) => {
            console.log(`Image "${imageData._id}" created!`)

            for (let tag of tags) {
              addImageToTag({
                name: tag,
                imageId: imageData._id
              })
                .then((msg) => {
                  console.log(msg)
                })
            }
          })
      })
  },
  findByTag: (tagName) => {
    return new Promise((resolve, reject) => {
      Tag
        .findOne({name: tagName})
        .then((tagData) => {
          Image
            .find({tags: tagData._id})//finds all with _id
            .then((images) => {
              let sortedImages = images.sort((a, b) => a.creationDate < b.creationDate)

              for (let image of sortedImages) {
                console.log(image.creationDate)
              }

              resolve(sortedImages)
            })
        })
    })
  },
  filter: (minDate, maxDate, result) => {
    if (!result) {
      result = 10
    }
    if (!minDate) {  //  ?????????????????
      minDate = new Date(-8640000000000000).toISOString()
    }
    if (!maxDate) {
      maxDate = new Date().toISOString()
    }

    return new Promise((resolve, reject) => {
      Image.find({
        creationDate: {
          $gte: minDate,
          $lte: maxDate
        }
      })
        .limit(result)
        .then((images) => {
          resolve(images)
        })
    })
  }
}
