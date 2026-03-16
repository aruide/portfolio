interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  created_at: string;
  fork: boolean;
}

interface GithubSearchResponse {
  total_count: number;
  items: GithubRepo[];
}

async function syncGithubProjects({ strapi }: { strapi: any }) {
  const username = process.env.GITHUB_USERNAME ?? 'aruide';
  const token = process.env.GITHUB_TOKEN;
  const topic = process.env.GITHUB_PORTFOLIO_TOPIC ?? 'portfolio';

  strapi.log.info(`[github-sync] Démarrage de la synchronisation (user: ${username}, topic: ${topic})`);

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let items: GithubRepo[] = [];
  try {
    const url = `https://api.github.com/search/repositories?q=user:${username}+topic:${topic}&per_page=100&sort=created&order=desc`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      strapi.log.error(`[github-sync] Erreur GitHub API: ${res.status} ${res.statusText}`);
      return;
    }

    const json = (await res.json()) as GithubSearchResponse;
    items = json.items.filter((r) => !r.fork);
    strapi.log.info(`[github-sync] ${items.length} repo(s) trouvé(s) avec le topic "${topic}"`);
  } catch (err) {
    strapi.log.error(`[github-sync] Erreur réseau: ${err}`);
    return;
  }

  for (const repo of items) {
    try {
      const data = {
        github_id: repo.id,
        name: repo.name,
        description: repo.description ?? '',
        github_url: repo.html_url,
        topics: repo.topics,
        creation_date: repo.created_at,
      };

      // Cherche un projet existant par github_id
      const existing = await strapi.documents('api::projet.projet').findMany({
        filters: { github_id: { $eq: repo.id } },
      });

      if (existing.length > 0) {
        await strapi.documents('api::projet.projet').update({
          documentId: existing[0].documentId,
          data,
        });
        strapi.log.info(`[github-sync] Mis à jour : ${repo.name}`);
      } else {
        const created = await strapi.documents('api::projet.projet').create({ data });
        await strapi.documents('api::projet.projet').publish({ documentId: created.documentId });
        strapi.log.info(`[github-sync] Créé : ${repo.name}`);
      }
    } catch (err) {
      strapi.log.error(`[github-sync] Erreur pour ${repo.name}: ${err}`);
    }
  }

  strapi.log.info('[github-sync] Synchronisation terminée');
}

// Sync géré par n8n — pour réactiver le cron Strapi, décommenter ci-dessous :
// export default {
//   githubSync: {
//     task: syncGithubProjects,
//     options: { rule: '0 */6 * * *' },
//   },
// };

export default {};
