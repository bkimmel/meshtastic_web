import React from 'react';

import useSWR from 'swr';

import fetcher from '@app/core/utils/fetcher';
import { useAppSelector } from '@app/hooks/useAppSelector';

export interface File {
  nameModified: string;
  name: string;
  size: number;
}

export interface Files {
  data: {
    files: File[];
    fileSystem: {
      total: number;
      used: number;
      free: number;
    };
  };
  status: string;
}

export const FileBrowser = (): JSX.Element => {
  const connectionParams = useAppSelector(
    (state) => state.app.connectionParams,
  );

  const { data } = useSWR<Files>(
    `${connectionParams.HTTP.tls ? 'https' : 'http'}://${
      connectionParams.HTTP.address
    }/json/spiffs/browse/static`,
    fetcher,
  );

  return (
    <div className="flex h-full w-full select-none flex-col gap-4 p-4">
      <div className="w-full flex-grow rounded-md bg-gray-200 dark:bg-primaryDark">
        <div className="flex h-10 w-full rounded-t-md bg-gray-300 px-4 text-lg font-semibold dark:bg-zinc-700 dark:text-white">
          <div className="my-auto  w-1/3">FileName</div>
          <div className="my-auto  w-1/3">Actions</div>
        </div>
        <div className="px-4">
          {data?.data.files.map((file) => (
            <div
              key={file.name}
              className="flex h-10 w-full border-b border-gray-500 px-4 font-medium dark:text-white"
            >
              <div className="my-auto  w-1/3">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${connectionParams.HTTP.tls ? 'https' : 'http'}://${
                    connectionParams.HTTP.address
                  }/${file.name.replace('static/', '')}`}
                >
                  {file.name.replace('static/', '').replace('.gz', '')}
                </a>
              </div>
              <div className="my-auto  w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
