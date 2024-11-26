export type GetPacketaScriptUrlOptions = {
  version?: {
    /**
     * @default v6
     */
    api?: string;
    /**
     * @default 1.0.7
     */
    script?: string;
  };
};

export const getPacketaScriptUrl = ({
  version: { api: apiVersion = `v6`, script: scriptVersion = '1.0.7' } = {},
}: GetPacketaScriptUrlOptions = {}) =>
  new URL(
    `https://widget.packeta.com/${apiVersion}/www/js/library-${scriptVersion}.js`,
  );
