import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve('pictureforwebsite');
const destDir = path.resolve('public/images');

async function processImages() {
  console.log('Processing images from', srcDir, 'to', destDir);

  // 1. Laser Hair Removal
  const laserSrc = path.join(srcDir, 'AdobeStock_1875685256.jpeg');
  if (fs.existsSync(laserSrc)) {
    await sharp(laserSrc)
      .jpeg({ quality: 90 })
      .toFile(path.join(destDir, 'service-laser-treatment.jpg'));
    console.log('Created service-laser-treatment.jpg');
  }

  // 2. Hydrofacial
  const hydroSrc = path.join(srcDir, 'Hydro facial pic 1.jpg');
  if (fs.existsSync(hydroSrc)) {
    await sharp(hydroSrc)
      .jpeg({ quality: 90 })
      .toFile(path.join(destDir, 'treatment-hydrofacial.jpg'));
    console.log('Created treatment-hydrofacial.jpg');
  }

  // 3. Natalie Sweeney Portrait
  const natalieSrc = path.join(srcDir, 'IMG_0256.PNG');
  if (fs.existsSync(natalieSrc)) {
    fs.copyFileSync(natalieSrc, path.join(destDir, 'natalie-sweeney-portrait.png'));
    await sharp(natalieSrc)
      .webp({ quality: 90 })
      .toFile(path.join(destDir, 'natalie-sweeney-portrait.webp'));
    console.log('Created natalie-sweeney-portrait.png & webp');
  }

  // 4. Before / After comparisons
  const comparisons = [
    {
      file: 'AdobeStock_2187421098 (1).jpeg',
      baseName: 'ba-photofacial-pigmentation',
      title: 'BBL Photofacial & Pigmentation'
    },
    {
      file: 'AdobeStock_2185640129 (1).jpeg',
      baseName: 'ba-wrinkle-reduction',
      title: 'Wrinkle Reduction & Texture'
    },
    {
      file: 'AdobeStock_2188156665.jpeg',
      baseName: 'ba-eye-rejuvenation',
      title: 'Eye Area Rejuvenation'
    },
    {
      file: 'AdobeStock_2188159402 (1).jpeg',
      baseName: 'ba-facial-tightening',
      title: 'Facial Tightening & Pores'
    },
    {
      file: 'AdobeStock_2198585066.jpeg',
      baseName: 'ba-eye-lift',
      title: 'Under-Eye & Eyelid Lift'
    },
    {
      file: 'AdobeStock_315880763 (1).jpeg',
      baseName: 'ba-melasma-clearing',
      title: 'Melasma & Sun Spot Removal'
    }
  ];

  for (const comp of comparisons) {
    const filePath = path.join(srcDir, comp.file);
    if (!fs.existsSync(filePath)) {
      console.warn('File not found:', filePath);
      continue;
    }

    const metadata = await sharp(filePath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    const halfWidth = Math.floor(width / 2);

    console.log(`Processing ${comp.baseName}: ${width}x${height}`);

    // Save full side-by-side
    await sharp(filePath)
      .jpeg({ quality: 90 })
      .toFile(path.join(destDir, `${comp.baseName}-full.jpg`));

    // Crop Left (Before)
    await sharp(filePath)
      .extract({ left: 0, top: 0, width: halfWidth, height: height })
      .jpeg({ quality: 90 })
      .toFile(path.join(destDir, `${comp.baseName}-before.jpg`));

    // Crop Right (After)
    await sharp(filePath)
      .extract({ left: halfWidth, top: 0, width: width - halfWidth, height: height })
      .jpeg({ quality: 90 })
      .toFile(path.join(destDir, `${comp.baseName}-after.jpg`));

    console.log(`Successfully generated ${comp.baseName} full, before, and after!`);
  }

  console.log('All image processing complete!');
}

processImages().catch(console.error);
