import { Typography } from '@jenesei-software/jenesei-kit-react';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { FC } from 'react';

import { TestProps } from '.';

export const Test: FC<TestProps> = () => {
  return (
    <Stack>
      <Typography
        sx={{
          variant: 'headline',
        }}
      >
        Test
      </Typography>
    </Stack>
  );
};
