import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OP_GG_MCP = "https://mcp-api.op.gg/mcp";

async function callMcpTool(toolName, args) {
  const payload = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args,
    },
  };

  const res = await fetch(OP_GG_MCP, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error("OP.GG MCP HTTP " + res.status + ": " + text);
  }

  if (json.error) {
    throw new Error("OP.GG MCP error: " + JSON.stringify(json.error));
  }

  return json.result ? json.result : json;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function parseChampionAnalysisText(txt, wantedPositionName) {
  const out = {
    winRate: null,
    patch: null,
    bestBuild: {
      items: [],
      winRate: null,
      games: null,
    },
  };

  if (!txt || typeof txt !== "string") return out;

  const mPatch = txt.match(/Win\("([^"]+)"\s*,/);
  if (mPatch && mPatch[1]) out.patch = mPatch[1];

  const posRegex = new RegExp(
    'Position\\("' + wantedPositionName + '"\\s*,Stats\\(\\d+\\s*,([0-9.]+)\\s*,',
    "i"
  );

  const mPos = txt.match(posRegex);

  if (mPos && mPos[1] != null) {
    const wr = Number(mPos[1]);
    if (isFinite(wr)) out.winRate = wr;
  }

  const coreRe =
    /CoreItems\(\[([0-9,\s]+)\]\s*,\[[^\]]*\]\s*,(\d+)\s*,(\d+)\s*,([0-9.]+)\)/g;

  let best = null;
  let match;

  while ((match = coreRe.exec(txt)) !== null) {
    const idsStr = match[1];
    const play = Number(match[2]);
    const win = Number(match[3]);

    if (!idsStr || !isFinite(play) || !isFinite(win) || play <= 0) continue;

    const items = idsStr
      .split(",")
      .map((s) => Number(String(s).trim()))
      .filter((x) => isFinite(x) && x > 0);

    if (items.length < 3) continue;

    const wr = win / play;

    if (!best || wr > best.wr) {
      best = { items: items.slice(0, 6), play, win, wr };
    }
  }

  if (best) {
    out.bestBuild.items = best.items;
    out.bestBuild.winRate = best.wr;
    out.bestBuild.games = best.play;
  }

  return out;
}

app.get("/api/meta/kalista", async function (req, res) {
  try {
    const region = req.query.region || "br";
    const position = req.query.position || "adc";
    const tier = req.query.tier || "emerald_plus";
    const game_mode = req.query.game_mode || "ranked";

    const args = {
      region: region,
      champion: "Kalista",
      position: position,
      tier: tier,
      game_mode: game_mode,
    };

    const result = await callMcpTool("lol_get_champion_analysis", args);

    const data = result && result.data ? result.data : result;

    let rawText = null;

    if (data && data.content && data.content.length) {
      for (let i = 0; i < data.content.length; i++) {
        if (data.content[i] && data.content[i].text) {
          rawText = data.content[i].text;
          break;
        }
      }
    }

    const wantedPosName =
      String(position).toUpperCase() === "ADC"
        ? "ADC"
        : String(position).toUpperCase();

    const parsed = parseChampionAnalysisText(rawText, wantedPosName);

    res.json({
      source: "opgg",
      champion: "Kalista",
      position: position,
      tier: tier,
      game_mode: game_mode,
      patch: parsed.patch,
      winRate: parsed.winRate,
      highestWinBuild: {
        winRate: parsed.bestBuild.winRate,
        games: parsed.bestBuild.games,
        items: parsed.bestBuild.items,
      },
      rawHint:
        parsed.winRate == null || parsed.bestBuild.items.length === 0
          ? { text: rawText }
          : undefined,
    });
  } catch (err) {
    res.status(500).json({
      error: String((err && err.message) || err),
    });
  }
});

app.listen(5175, function () {
  console.log("API rodando em http://localhost:5175");
});