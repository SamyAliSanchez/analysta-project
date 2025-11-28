import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { AssetsService } from '../../assets/assets.service';
import { CreateAssetDto } from '../../assets/dto/create-asset.dto';

const EXOTIC_ASSETS: CreateAssetDto[] = [
  {
    symbol: 'QCRD',
    name: 'Quantum Credit',
    category: 'exotic',
    volatility: 0.65,
    description:
      'A revolutionary credit instrument backed by quantum entanglement principles. Highly volatile but offers unprecedented yield potential in parallel universes.',
  },
  {
    symbol: 'PHBN',
    name: 'Photon Bond',
    category: 'bond',
    volatility: 0.25,
    description:
      'A stable fixed-income security backed by photon stream revenues from deep space communication networks. Lower risk, consistent returns.',
  },
  {
    symbol: 'DRKM',
    name: 'Dark Matter Future',
    category: 'derivative',
    volatility: 0.8,
    description:
      'A high-risk derivative contract based on dark matter density fluctuations. Extreme volatility with massive profit potential for experienced traders.',
  },
  {
    symbol: 'NBLX',
    name: 'Nebula ETF',
    category: 'equity',
    volatility: 0.45,
    description:
      'A diversified exchange-traded fund tracking a basket of interstellar mining operations and gas cloud extraction companies. Balanced risk-reward profile.',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const assetsService = app.get(AssetsService);

  console.log('🌱 Starting asset seed...');

  let created = 0;
  let skipped = 0;

  for (const assetData of EXOTIC_ASSETS) {
    const exists = await assetsService.exists(assetData.symbol);
    if (exists) {
      console.log(`⏭️  Asset ${assetData.symbol} already exists, skipping...`);
      skipped++;
      continue;
    }

    try {
      await assetsService.create(assetData);
      console.log(`✅ Created asset: ${assetData.symbol} - ${assetData.name}`);
      created++;
    } catch (error) {
      console.error(
        `❌ Failed to create asset ${assetData.symbol}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.log('\n📊 Seed Summary:');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${EXOTIC_ASSETS.length}`);

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('💥 Seed failed:', error);
  process.exit(1);
});

