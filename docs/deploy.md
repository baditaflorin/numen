# Deployment

Live Pages URL: https://baditaflorin.github.io/numen/

Repository URL: https://github.com/baditaflorin/numen

Numen publishes from `main` branch `/docs`.

## Publish

```bash
make data
make test
make build
make smoke
git add .
git commit -m "feat: publish update"
git push
```

## Rollback

Revert the publishing commit and push:

```bash
git revert <commit>
git push
```

## Custom Domain

No custom domain is configured in v1. To add one, commit `docs/CNAME` containing the domain, then configure DNS with a CNAME record pointing to `baditaflorin.github.io`.

GitHub Pages does not support `_headers` or `_redirects`; SPA fallback is handled by `docs/404.html`.
