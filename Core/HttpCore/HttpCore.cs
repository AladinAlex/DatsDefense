using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Core.Algoritms
{
    public class HttpCore
    {
        private const string BaseUrl = "https://games.datsteam.dev/";
        private const string DevBaseUrl = "https://games-test.datsteam.dev/";
        readonly openapiClient devteamClient;
        public HttpCore(bool devServer = true)
        {
            var httpClient = new HttpClient();
            if (devServer)
                httpClient.BaseAddress = new Uri(DevBaseUrl);
            else
                httpClient.BaseAddress = new Uri(BaseUrl);

            httpClient.DefaultRequestHeaders.Add("X-Auth-Token", "668ee4f86d598668ee4f86d59b");

            devteamClient = new(httpClient);
        }

        public async Task<ValidationErrors> Command(Core.Command command)
        {
            var result = await devteamClient.CommandAsync(command);
            return result;
        }

        public async Task<ParticipateResponse> StartRound()
        {
            var result = await devteamClient.ParticipateAsync();
            return result;
        }

        public async Task<UnitsResponse> DynamicMap()
        {
            return await devteamClient.UnitsAsync();
        }

        public async Task<MapResponse> StaticMap()
        {
            return await devteamClient.WorldAsync();
        }
        public async Task<RoundList> RoundList()
        {
            return await devteamClient.ZombidefAsync();
        }
    }
}
