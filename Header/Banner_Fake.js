const banners = [

  {
    'Title': 'Tonight At 10',
    'Type': 'link',
    'Link': 'http://www.newson6.com/story/18251082/tonight-at-10',
    'Description': 'Big reveal of that story we\'ve been talking about',
    'Target': '_self',
    'BannerTypeId': 3,
    'BannerInfoTypeMask': 7,
    'EncoderTypeId': 0,
    'Audio': false,
    'Theme': '',
    'Content': 'Livestreaming'
  },
  {
    'Title': 'Earthquake Alert',
    'Type': 'earthquake',
    'Link': 'http://www.newson6.com/Earthquake',
    'Description': 'At 7:59AM a magnitude 5.3 was reported in Tulsa County',
    'Target': '_self',
    'BannerTypeId': 15,
    'BannerInfoTypeMask': 71,
    'EncoderTypeId': 0,
    'Audio': false,
    'Theme': '',
    'Content': ''
  },
  {
    'Title': 'Breaking News',
    'Type': 'earthquake',
    'Link': 'http://www.newson6.com/space-aliens',
    'Description': 'Police Officer Accused of Not Shooting Unarmed Man',
    'Target': '_self',
    'BannerTypeId': 0,
    'BannerInfoTypeMask': 71,
    'EncoderTypeId': 0,
    'Audio': false,
    'Theme': '',
    'Content': ''
  }
  ,
  {
    'Title': 'Live Now',
    'Type': 'earthquake',
    'Link': '',
    'Description': 'Another Extraterrestrial Landing Craft over Tulsa',
    'Target': '_self',
    'BannerTypeId': 0,
    'BannerInfoTypeMask': 71,
    'EncoderTypeId': 0,
    EncoderUrls: [{
      EncoderUrlTypeTitle: "Mobile",
      Url: 'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
    },
    {
      EncoderUrlTypeTitle: "Mobile",
      Url: 'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
    }],
    'Audio': false,
    'Theme': '',
    'Content': ''
  }

];

export default banners;
