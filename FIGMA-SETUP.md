# Figma Token Studio → GitHub Auto-Sync Setup

## Automatische Synchronisatie Instellen

### Stap 1: GitHub Personal Access Token Maken

1. Ga naar [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Klik **"Generate new token (classic)"**
3. Selecteer scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
4. Kopieer de token (bewaar deze veilig!)

### Stap 2: Figma Token Studio Webhook Configureren

1. Open **Figma Token Studio**
2. Ga naar **Settings → Storage → GitHub**
3. Voeg deze webhook URL toe:

   <https://api.github.com/repos/MindEngineDev/DesignSystem/dispatches>

4. Headers instellen:

   Authorization: Bearer JE_GITHUB_TOKEN_HIER
   Content-Type: application/json
   Accept: application/vnd.github.v3+json

5. JSON Payload:
json
   {
     "event_type": "figma-tokens-update",
     "client_payload": {
       "source": "figma-token-studio",
       "timestamp": "2025-09-27T10:00:00Z"
     }
   }

### Stap 3: Test de Sync

Run het setup script voor details:

```bash
npm run setup:figma
```

Handmatig testen:

```bash
npm run sync
```

## Hoe het Werkt

1. **Figma aanpassing** → Token Studio detecteert wijziging
2. **Webhook trigger** → GitHub Action wordt geactiveerd  
3. **Auto-build** → Style Dictionary bouwt CSS/JSON/JS files
4. **Auto-commit** → Wijzigingen worden gecommit naar production branch
5. **Auto-deploy** → Site wordt geüpdatet op GitHub Pages

## Handmatige Commands

```bash
# Start development met token watching
npm run dev

# Sync tokens handmatig
npm run sync

# Maak nieuwe component
npm run new card

# Toon Figma webhook setup
npm run setup:figma
```

## Troubleshooting

**Token sync faalt?**

- Check GitHub token permissions
- Verificeer webhook URL in Figma Token Studio
- Bekijk GitHub Actions logs in je repo

**Tokens niet bijgewerkt?**

- Run `npm run sync` handmatig
- Check of `packages/tokens/` files zijn gewijzigd
- Kijk naar `site/dist/` output files

**Development server problemen?**

- Stop alle terminals (`Ctrl+C`)
- Run `npm run dev` opnieuw
- Check <http://localhost:5173>

---

✅ **Je Design System is nu volledig geautomatiseerd!**
Figma wijzigingen verschijnen automatisch in je repo en op je website.
