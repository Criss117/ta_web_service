import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

function corsOptions(...args: string[]): CorsOptions {
  return {
    origin: (origin, callback) => {
      if (args.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  };
}

export default corsOptions;
