/**
 * NBA Analytics Dashboard — Data Layer
 * Design: "Fast Break" — Premium Sports Analytics
 * Data: 2024-25 NBA Season curated statistics
 */

export interface Player {
  id: number;
  name: string;
  team: string;
  teamAbbr: string;
  position: string;
  age: number;
  number: string;
  gp: number;
  mpg: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  topg: number;
  fgPct: number;
  fg3Pct: number;
  ftPct: number;
  plusMinus: number;
  per: number;
  ts: number;
  ws: number;
  bpm: number;
  imageUrl?: string;
}

export interface Team {
  id: number;
  name: string;
  abbr: string;
  city: string;
  conference: "East" | "West";
  division: string;
  wins: number;
  losses: number;
  pct: number;
  gb: number;
  homeRecord: string;
  awayRecord: string;
  lastTen: string;
  streak: string;
  ppg: number;
  oppPpg: number;
  color: string;
  secondaryColor: string;
}

export interface GameLog {
  date: string;
  opponent: string;
  result: "W" | "L";
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  plusMinus: number;
  min: number;
}

export interface SeasonTrend {
  month: string;
  ppg: number;
  rpg: number;
  apg: number;
  fgPct: number;
}

export const TOP_PLAYERS: Player[] = [
  {
    id: 1, name: "Shai Gilgeous-Alexander", team: "Oklahoma City Thunder", teamAbbr: "OKC",
    position: "PG", age: 26, number: "2", gp: 68, mpg: 33.8,
    ppg: 32.7, rpg: 5.5, apg: 6.4, spg: 2.0, bpg: 1.0, topg: 2.8,
    fgPct: 51.9, fg3Pct: 37.8, ftPct: 87.4, plusMinus: 9.8,
    per: 31.2, ts: 63.8, ws: 14.2, bpm: 9.4,
  },
  {
    id: 2, name: "Nikola Jokic", team: "Denver Nuggets", teamAbbr: "DEN",
    position: "C", age: 30, number: "15", gp: 70, mpg: 34.6,
    ppg: 29.6, rpg: 13.0, apg: 10.2, spg: 1.4, bpg: 0.9, topg: 3.5,
    fgPct: 57.3, fg3Pct: 35.9, ftPct: 81.7, plusMinus: 11.2,
    per: 34.8, ts: 65.4, ws: 16.8, bpm: 12.1,
  },
  {
    id: 3, name: "Giannis Antetokounmpo", team: "Milwaukee Bucks", teamAbbr: "MIL",
    position: "PF", age: 30, number: "34", gp: 65, mpg: 35.1,
    ppg: 30.4, rpg: 11.9, apg: 6.5, spg: 1.2, bpg: 1.1, topg: 3.4,
    fgPct: 61.0, fg3Pct: 27.4, ftPct: 65.2, plusMinus: 7.3,
    per: 32.1, ts: 64.2, ws: 13.4, bpm: 10.2,
  },
  {
    id: 4, name: "Luka Doncic", team: "Los Angeles Lakers", teamAbbr: "LAL",
    position: "PG", age: 26, number: "77", gp: 58, mpg: 35.7,
    ppg: 28.7, rpg: 8.6, apg: 8.0, spg: 1.4, bpg: 0.5, topg: 3.8,
    fgPct: 47.2, fg3Pct: 37.5, ftPct: 79.3, plusMinus: 5.1,
    per: 28.9, ts: 59.8, ws: 9.8, bpm: 8.2,
  },
  {
    id: 5, name: "Jayson Tatum", team: "Boston Celtics", teamAbbr: "BOS",
    position: "SF", age: 27, number: "0", gp: 71, mpg: 35.4,
    ppg: 26.9, rpg: 8.1, apg: 4.9, spg: 1.1, bpg: 0.6, topg: 2.7,
    fgPct: 46.8, fg3Pct: 37.2, ftPct: 82.1, plusMinus: 8.4,
    per: 24.7, ts: 59.3, ws: 11.2, bpm: 6.8,
  },
  {
    id: 6, name: "Anthony Edwards", team: "Minnesota Timberwolves", teamAbbr: "MIN",
    position: "SG", age: 23, number: "5", gp: 72, mpg: 35.2,
    ppg: 26.4, rpg: 5.4, apg: 5.1, spg: 1.3, bpg: 0.6, topg: 3.1,
    fgPct: 46.3, fg3Pct: 36.9, ftPct: 83.2, plusMinus: 6.7,
    per: 23.4, ts: 58.7, ws: 10.1, bpm: 5.9,
  },
  {
    id: 7, name: "LeBron James", team: "Los Angeles Lakers", teamAbbr: "LAL",
    position: "SF", age: 40, number: "23", gp: 67, mpg: 34.9,
    ppg: 24.3, rpg: 7.8, apg: 8.2, spg: 1.1, bpg: 0.5, topg: 3.6,
    fgPct: 52.4, fg3Pct: 40.1, ftPct: 74.9, plusMinus: 4.2,
    per: 25.3, ts: 61.8, ws: 8.9, bpm: 5.4,
  },
  {
    id: 8, name: "Stephen Curry", team: "Golden State Warriors", teamAbbr: "GSW",
    position: "PG", age: 37, number: "30", gp: 69, mpg: 32.7,
    ppg: 24.6, rpg: 4.6, apg: 5.2, spg: 0.9, bpg: 0.3, topg: 2.9,
    fgPct: 46.2, fg3Pct: 41.3, ftPct: 92.3, plusMinus: 5.8,
    per: 23.8, ts: 62.4, ws: 9.7, bpm: 5.1,
  },
  {
    id: 9, name: "Kevin Durant", team: "Phoenix Suns", teamAbbr: "PHX",
    position: "SF", age: 36, number: "35", gp: 66, mpg: 36.1,
    ppg: 27.1, rpg: 6.8, apg: 4.2, spg: 0.9, bpg: 1.2, topg: 3.1,
    fgPct: 52.8, fg3Pct: 41.8, ftPct: 85.6, plusMinus: 3.9,
    per: 26.4, ts: 63.1, ws: 9.2, bpm: 6.1,
  },
  {
    id: 10, name: "Donovan Mitchell", team: "Cleveland Cavaliers", teamAbbr: "CLE",
    position: "SG", age: 28, number: "45", gp: 70, mpg: 34.8,
    ppg: 26.1, rpg: 5.1, apg: 5.8, spg: 1.5, bpg: 0.5, topg: 2.6,
    fgPct: 47.9, fg3Pct: 38.4, ftPct: 86.7, plusMinus: 7.1,
    per: 24.1, ts: 60.2, ws: 10.4, bpm: 6.3,
  },
  {
    id: 11, name: "Tyrese Haliburton", team: "Indiana Pacers", teamAbbr: "IND",
    position: "PG", age: 25, number: "0", gp: 62, mpg: 33.4,
    ppg: 20.1, rpg: 3.9, apg: 10.9, spg: 1.4, bpg: 0.4, topg: 3.2,
    fgPct: 47.3, fg3Pct: 38.9, ftPct: 88.1, plusMinus: 6.2,
    per: 22.7, ts: 60.8, ws: 8.6, bpm: 5.7,
  },
  {
    id: 12, name: "Devin Booker", team: "Phoenix Suns", teamAbbr: "PHX",
    position: "SG", age: 28, number: "1", gp: 68, mpg: 35.3,
    ppg: 25.3, rpg: 4.5, apg: 6.9, spg: 0.8, bpg: 0.4, topg: 3.3,
    fgPct: 48.1, fg3Pct: 36.7, ftPct: 89.4, plusMinus: 2.1,
    per: 22.9, ts: 60.1, ws: 7.8, bpm: 4.3,
  },
  {
    id: 13, name: "Bam Adebayo", team: "Miami Heat", teamAbbr: "MIA",
    position: "C", age: 27, number: "13", gp: 71, mpg: 34.7,
    ppg: 19.6, rpg: 10.4, apg: 4.1, spg: 1.1, bpg: 0.9, topg: 2.4,
    fgPct: 53.7, fg3Pct: 0.0, ftPct: 72.3, plusMinus: 4.8,
    per: 22.1, ts: 59.4, ws: 8.9, bpm: 3.8,
  },
  {
    id: 14, name: "Trae Young", team: "Atlanta Hawks", teamAbbr: "ATL",
    position: "PG", age: 26, number: "11", gp: 68, mpg: 34.2,
    ppg: 23.8, rpg: 3.2, apg: 11.4, spg: 1.0, bpg: 0.2, topg: 4.1,
    fgPct: 43.7, fg3Pct: 36.2, ftPct: 87.9, plusMinus: -2.4,
    per: 21.8, ts: 58.3, ws: 5.4, bpm: 3.1,
  },
  {
    id: 15, name: "Ja Morant", team: "Memphis Grizzlies", teamAbbr: "MEM",
    position: "PG", age: 25, number: "12", gp: 55, mpg: 32.1,
    ppg: 22.4, rpg: 5.6, apg: 8.1, spg: 1.2, bpg: 0.5, topg: 3.4,
    fgPct: 47.8, fg3Pct: 32.1, ftPct: 75.6, plusMinus: 1.8,
    per: 21.4, ts: 57.9, ws: 5.8, bpm: 3.6,
  },
];

export const TEAM_STANDINGS: Team[] = [
  // Eastern Conference
  {
    id: 1, name: "Cleveland Cavaliers", abbr: "CLE", city: "Cleveland",
    conference: "East", division: "Central",
    wins: 62, losses: 20, pct: 0.756, gb: 0,
    homeRecord: "33-8", awayRecord: "29-12", lastTen: "8-2", streak: "W3",
    ppg: 115.2, oppPpg: 107.4, color: "#6F263D", secondaryColor: "#FFB81C",
  },
  {
    id: 2, name: "Boston Celtics", abbr: "BOS", city: "Boston",
    conference: "East", division: "Atlantic",
    wins: 58, losses: 24, pct: 0.707, gb: 4,
    homeRecord: "31-10", awayRecord: "27-14", lastTen: "7-3", streak: "W1",
    ppg: 118.6, oppPpg: 110.2, color: "#007A33", secondaryColor: "#BA9653",
  },
  {
    id: 3, name: "New York Knicks", abbr: "NYK", city: "New York",
    conference: "East", division: "Atlantic",
    wins: 52, losses: 30, pct: 0.634, gb: 10,
    homeRecord: "29-12", awayRecord: "23-18", lastTen: "6-4", streak: "L1",
    ppg: 113.4, oppPpg: 109.8, color: "#006BB6", secondaryColor: "#F58426",
  },
  {
    id: 4, name: "Milwaukee Bucks", abbr: "MIL", city: "Milwaukee",
    conference: "East", division: "Central",
    wins: 49, losses: 33, pct: 0.598, gb: 13,
    homeRecord: "27-14", awayRecord: "22-19", lastTen: "5-5", streak: "W2",
    ppg: 116.8, oppPpg: 113.2, color: "#00471B", secondaryColor: "#EEE1C6",
  },
  {
    id: 5, name: "Indiana Pacers", abbr: "IND", city: "Indianapolis",
    conference: "East", division: "Central",
    wins: 47, losses: 35, pct: 0.573, gb: 15,
    homeRecord: "26-15", awayRecord: "21-20", lastTen: "6-4", streak: "W1",
    ppg: 122.1, oppPpg: 118.7, color: "#002D62", secondaryColor: "#FDBB30",
  },
  {
    id: 6, name: "Miami Heat", abbr: "MIA", city: "Miami",
    conference: "East", division: "Southeast",
    wins: 44, losses: 38, pct: 0.537, gb: 18,
    homeRecord: "24-17", awayRecord: "20-21", lastTen: "5-5", streak: "L2",
    ppg: 111.3, oppPpg: 110.1, color: "#98002E", secondaryColor: "#F9A01B",
  },
  {
    id: 7, name: "Philadelphia 76ers", abbr: "PHI", city: "Philadelphia",
    conference: "East", division: "Atlantic",
    wins: 42, losses: 40, pct: 0.512, gb: 20,
    homeRecord: "23-18", awayRecord: "19-22", lastTen: "4-6", streak: "L3",
    ppg: 112.7, oppPpg: 113.4, color: "#006BB6", secondaryColor: "#ED174C",
  },
  {
    id: 8, name: "Orlando Magic", abbr: "ORL", city: "Orlando",
    conference: "East", division: "Southeast",
    wins: 41, losses: 41, pct: 0.500, gb: 21,
    homeRecord: "22-19", awayRecord: "19-22", lastTen: "5-5", streak: "W1",
    ppg: 108.9, oppPpg: 108.2, color: "#0077C0", secondaryColor: "#C4CED4",
  },
  // Western Conference
  {
    id: 9, name: "Oklahoma City Thunder", abbr: "OKC", city: "Oklahoma City",
    conference: "West", division: "Northwest",
    wins: 64, losses: 18, pct: 0.780, gb: 0,
    homeRecord: "34-7", awayRecord: "30-11", lastTen: "9-1", streak: "W5",
    ppg: 119.3, oppPpg: 108.6, color: "#007AC1", secondaryColor: "#EF3B24",
  },
  {
    id: 10, name: "Houston Rockets", abbr: "HOU", city: "Houston",
    conference: "West", division: "Southwest",
    wins: 52, losses: 30, pct: 0.634, gb: 12,
    homeRecord: "28-13", awayRecord: "24-17", lastTen: "7-3", streak: "W2",
    ppg: 114.8, oppPpg: 110.3, color: "#CE1141", secondaryColor: "#C4CED4",
  },
  {
    id: 11, name: "Denver Nuggets", abbr: "DEN", city: "Denver",
    conference: "West", division: "Northwest",
    wins: 50, losses: 32, pct: 0.610, gb: 14,
    homeRecord: "28-13", awayRecord: "22-19", lastTen: "6-4", streak: "W1",
    ppg: 117.4, oppPpg: 113.1, color: "#0E2240", secondaryColor: "#FEC524",
  },
  {
    id: 12, name: "Los Angeles Lakers", abbr: "LAL", city: "Los Angeles",
    conference: "West", division: "Pacific",
    wins: 47, losses: 35, pct: 0.573, gb: 17,
    homeRecord: "26-15", awayRecord: "21-20", lastTen: "5-5", streak: "L1",
    ppg: 115.9, oppPpg: 113.7, color: "#552583", secondaryColor: "#FDB927",
  },
  {
    id: 13, name: "Minnesota Timberwolves", abbr: "MIN", city: "Minneapolis",
    conference: "West", division: "Northwest",
    wins: 46, losses: 36, pct: 0.561, gb: 18,
    homeRecord: "25-16", awayRecord: "21-20", lastTen: "5-5", streak: "W2",
    ppg: 113.2, oppPpg: 111.4, color: "#0C2340", secondaryColor: "#236192",
  },
  {
    id: 14, name: "Golden State Warriors", abbr: "GSW", city: "San Francisco",
    conference: "West", division: "Pacific",
    wins: 44, losses: 38, pct: 0.537, gb: 20,
    homeRecord: "24-17", awayRecord: "20-21", lastTen: "5-5", streak: "W1",
    ppg: 116.2, oppPpg: 114.8, color: "#1D428A", secondaryColor: "#FFC72C",
  },
  {
    id: 15, name: "Phoenix Suns", abbr: "PHX", city: "Phoenix",
    conference: "West", division: "Pacific",
    wins: 40, losses: 42, pct: 0.488, gb: 24,
    homeRecord: "22-19", awayRecord: "18-23", lastTen: "4-6", streak: "L2",
    ppg: 114.1, oppPpg: 115.6, color: "#1D1160", secondaryColor: "#E56020",
  },
  {
    id: 16, name: "Dallas Mavericks", abbr: "DAL", city: "Dallas",
    conference: "West", division: "Southwest",
    wins: 38, losses: 44, pct: 0.463, gb: 26,
    homeRecord: "21-20", awayRecord: "17-24", lastTen: "4-6", streak: "L1",
    ppg: 112.8, oppPpg: 115.2, color: "#00538C", secondaryColor: "#002B5E",
  },
];

export const PLAYER_GAME_LOG: GameLog[] = [
  { date: "Apr 5", opponent: "LAL", result: "W", pts: 38, reb: 6, ast: 7, stl: 3, blk: 1, fgm: 14, fga: 24, fg3m: 3, fg3a: 7, ftm: 7, fta: 8, plusMinus: 18, min: 36 },
  { date: "Apr 3", opponent: "GSW", result: "W", pts: 42, reb: 4, ast: 8, stl: 2, blk: 0, fgm: 16, fga: 27, fg3m: 4, fg3a: 9, ftm: 6, fta: 7, plusMinus: 22, min: 38 },
  { date: "Apr 1", opponent: "DEN", result: "L", pts: 28, reb: 7, ast: 5, stl: 1, blk: 1, fgm: 10, fga: 22, fg3m: 2, fg3a: 6, ftm: 6, fta: 7, plusMinus: -4, min: 37 },
  { date: "Mar 30", opponent: "MEM", result: "W", pts: 35, reb: 5, ast: 9, stl: 2, blk: 0, fgm: 13, fga: 23, fg3m: 3, fg3a: 8, ftm: 6, fta: 6, plusMinus: 14, min: 35 },
  { date: "Mar 28", opponent: "SAC", result: "W", pts: 31, reb: 6, ast: 6, stl: 3, blk: 2, fgm: 11, fga: 20, fg3m: 3, fg3a: 7, ftm: 6, fta: 7, plusMinus: 9, min: 34 },
  { date: "Mar 26", opponent: "PHX", result: "W", pts: 44, reb: 5, ast: 7, stl: 2, blk: 1, fgm: 16, fga: 26, fg3m: 5, fg3a: 10, ftm: 7, fta: 8, plusMinus: 20, min: 39 },
  { date: "Mar 24", opponent: "MIN", result: "W", pts: 29, reb: 4, ast: 8, stl: 1, blk: 0, fgm: 11, fga: 21, fg3m: 2, fg3a: 6, ftm: 5, fta: 6, plusMinus: 7, min: 34 },
  { date: "Mar 22", opponent: "DAL", result: "L", pts: 24, reb: 5, ast: 6, stl: 1, blk: 1, fgm: 9, fga: 20, fg3m: 1, fg3a: 5, ftm: 5, fta: 6, plusMinus: -8, min: 36 },
  { date: "Mar 20", opponent: "HOU", result: "W", pts: 37, reb: 6, ast: 7, stl: 3, blk: 0, fgm: 14, fga: 25, fg3m: 3, fg3a: 8, ftm: 6, fta: 7, plusMinus: 16, min: 37 },
  { date: "Mar 18", opponent: "NOP", result: "W", pts: 33, reb: 5, ast: 8, stl: 2, blk: 1, fgm: 12, fga: 22, fg3m: 4, fg3a: 9, ftm: 5, fta: 6, plusMinus: 11, min: 35 },
];

export const SEASON_TRENDS: SeasonTrend[] = [
  { month: "Oct", ppg: 28.4, rpg: 5.1, apg: 5.8, fgPct: 49.2 },
  { month: "Nov", ppg: 30.1, rpg: 5.3, apg: 6.1, fgPct: 51.4 },
  { month: "Dec", ppg: 31.8, rpg: 5.4, apg: 6.3, fgPct: 52.7 },
  { month: "Jan", ppg: 33.2, rpg: 5.6, apg: 6.5, fgPct: 53.1 },
  { month: "Feb", ppg: 34.1, rpg: 5.7, apg: 6.8, fgPct: 52.4 },
  { month: "Mar", ppg: 33.8, rpg: 5.5, apg: 6.4, fgPct: 51.9 },
  { month: "Apr", ppg: 34.6, rpg: 5.8, apg: 6.6, fgPct: 53.2 },
];

export const SCORING_LEADERS = TOP_PLAYERS.slice().sort((a, b) => b.ppg - a.ppg).slice(0, 10);
export const ASSIST_LEADERS = TOP_PLAYERS.slice().sort((a, b) => b.apg - a.apg).slice(0, 10);
export const REBOUND_LEADERS = TOP_PLAYERS.slice().sort((a, b) => b.rpg - a.rpg).slice(0, 10);

export const EAST_STANDINGS = TEAM_STANDINGS.filter(t => t.conference === "East").sort((a, b) => b.wins - a.wins);
export const WEST_STANDINGS = TEAM_STANDINGS.filter(t => t.conference === "West").sort((a, b) => b.wins - a.wins);

export const TEAM_STATS_COMPARISON = [
  { category: "PPG", OKC: 119.3, BOS: 118.6, CLE: 115.2, DEN: 117.4, LAL: 115.9 },
  { category: "OPP PPG", OKC: 108.6, BOS: 110.2, CLE: 107.4, DEN: 113.1, LAL: 113.7 },
  { category: "3P%", OKC: 38.4, BOS: 39.1, CLE: 37.8, DEN: 36.2, LAL: 37.1 },
  { category: "FG%", OKC: 49.2, BOS: 48.7, CLE: 48.1, DEN: 50.3, LAL: 48.9 },
  { category: "AST", OKC: 27.4, BOS: 26.8, CLE: 25.1, DEN: 29.2, LAL: 26.3 },
  { category: "REB", OKC: 43.8, BOS: 44.2, CLE: 42.7, DEN: 46.1, LAL: 43.4 },
];

// Per-player monthly season trends for comparison mode
export const PLAYER_SEASON_TRENDS: Record<number, SeasonTrend[]> = {
  // SGA
  1: [
    { month: "Oct", ppg: 28.4, rpg: 5.1, apg: 5.8, fgPct: 49.2 },
    { month: "Nov", ppg: 30.1, rpg: 5.3, apg: 6.1, fgPct: 51.4 },
    { month: "Dec", ppg: 31.8, rpg: 5.4, apg: 6.3, fgPct: 52.7 },
    { month: "Jan", ppg: 33.2, rpg: 5.6, apg: 6.5, fgPct: 53.1 },
    { month: "Feb", ppg: 34.1, rpg: 5.7, apg: 6.8, fgPct: 52.4 },
    { month: "Mar", ppg: 33.8, rpg: 5.5, apg: 6.4, fgPct: 51.9 },
    { month: "Apr", ppg: 34.6, rpg: 5.8, apg: 6.6, fgPct: 53.2 },
  ],
  // Jokic
  2: [
    { month: "Oct", ppg: 25.2, rpg: 11.8, apg: 9.1, fgPct: 54.1 },
    { month: "Nov", ppg: 27.4, rpg: 12.4, apg: 9.8, fgPct: 56.2 },
    { month: "Dec", ppg: 28.9, rpg: 12.9, apg: 10.1, fgPct: 57.4 },
    { month: "Jan", ppg: 30.1, rpg: 13.2, apg: 10.5, fgPct: 58.1 },
    { month: "Feb", ppg: 31.4, rpg: 13.5, apg: 10.8, fgPct: 57.8 },
    { month: "Mar", ppg: 30.8, rpg: 13.1, apg: 10.3, fgPct: 57.3 },
    { month: "Apr", ppg: 31.2, rpg: 13.4, apg: 10.6, fgPct: 58.4 },
  ],
  // Giannis
  3: [
    { month: "Oct", ppg: 26.8, rpg: 10.9, apg: 5.8, fgPct: 58.2 },
    { month: "Nov", ppg: 28.4, rpg: 11.4, apg: 6.2, fgPct: 59.7 },
    { month: "Dec", ppg: 29.7, rpg: 11.7, apg: 6.4, fgPct: 60.8 },
    { month: "Jan", ppg: 31.2, rpg: 12.1, apg: 6.7, fgPct: 61.4 },
    { month: "Feb", ppg: 32.1, rpg: 12.3, apg: 6.9, fgPct: 61.2 },
    { month: "Mar", ppg: 30.9, rpg: 11.9, apg: 6.5, fgPct: 61.0 },
    { month: "Apr", ppg: 31.8, rpg: 12.2, apg: 6.8, fgPct: 61.5 },
  ],
  // Luka
  4: [
    { month: "Oct", ppg: 24.1, rpg: 7.8, apg: 7.2, fgPct: 44.8 },
    { month: "Nov", ppg: 26.3, rpg: 8.2, apg: 7.8, fgPct: 46.1 },
    { month: "Dec", ppg: 28.1, rpg: 8.5, apg: 8.1, fgPct: 47.4 },
    { month: "Jan", ppg: 29.4, rpg: 8.7, apg: 8.3, fgPct: 47.8 },
    { month: "Feb", ppg: 30.2, rpg: 8.9, apg: 8.5, fgPct: 47.2 },
    { month: "Mar", ppg: 28.7, rpg: 8.6, apg: 8.0, fgPct: 47.2 },
    { month: "Apr", ppg: 29.1, rpg: 8.8, apg: 8.2, fgPct: 47.6 },
  ],
  // Tatum
  5: [
    { month: "Oct", ppg: 23.1, rpg: 7.4, apg: 4.2, fgPct: 44.1 },
    { month: "Nov", ppg: 24.8, rpg: 7.8, apg: 4.6, fgPct: 45.7 },
    { month: "Dec", ppg: 26.2, rpg: 8.0, apg: 4.8, fgPct: 46.4 },
    { month: "Jan", ppg: 27.4, rpg: 8.2, apg: 5.1, fgPct: 47.1 },
    { month: "Feb", ppg: 28.1, rpg: 8.4, apg: 5.3, fgPct: 46.8 },
    { month: "Mar", ppg: 26.9, rpg: 8.1, apg: 4.9, fgPct: 46.8 },
    { month: "Apr", ppg: 27.3, rpg: 8.3, apg: 5.0, fgPct: 47.2 },
  ],
  // Ant Edwards
  6: [
    { month: "Oct", ppg: 22.4, rpg: 4.8, apg: 4.4, fgPct: 44.2 },
    { month: "Nov", ppg: 24.1, rpg: 5.1, apg: 4.8, fgPct: 45.4 },
    { month: "Dec", ppg: 25.8, rpg: 5.3, apg: 5.0, fgPct: 46.1 },
    { month: "Jan", ppg: 27.2, rpg: 5.5, apg: 5.2, fgPct: 46.7 },
    { month: "Feb", ppg: 27.9, rpg: 5.6, apg: 5.4, fgPct: 46.3 },
    { month: "Mar", ppg: 26.4, rpg: 5.4, apg: 5.1, fgPct: 46.3 },
    { month: "Apr", ppg: 27.1, rpg: 5.5, apg: 5.2, fgPct: 46.8 },
  ],
  // LeBron
  7: [
    { month: "Oct", ppg: 21.2, rpg: 7.1, apg: 7.6, fgPct: 50.1 },
    { month: "Nov", ppg: 22.8, rpg: 7.4, apg: 7.9, fgPct: 51.4 },
    { month: "Dec", ppg: 23.9, rpg: 7.7, apg: 8.1, fgPct: 52.1 },
    { month: "Jan", ppg: 24.8, rpg: 7.9, apg: 8.3, fgPct: 52.6 },
    { month: "Feb", ppg: 25.4, rpg: 8.1, apg: 8.5, fgPct: 52.4 },
    { month: "Mar", ppg: 24.3, rpg: 7.8, apg: 8.2, fgPct: 52.4 },
    { month: "Apr", ppg: 24.8, rpg: 8.0, apg: 8.4, fgPct: 52.7 },
  ],
  // Curry
  8: [
    { month: "Oct", ppg: 21.4, rpg: 4.2, apg: 4.8, fgPct: 44.1 },
    { month: "Nov", ppg: 22.9, rpg: 4.4, apg: 5.0, fgPct: 45.2 },
    { month: "Dec", ppg: 24.1, rpg: 4.5, apg: 5.1, fgPct: 45.8 },
    { month: "Jan", ppg: 25.2, rpg: 4.7, apg: 5.3, fgPct: 46.4 },
    { month: "Feb", ppg: 25.8, rpg: 4.8, apg: 5.4, fgPct: 46.2 },
    { month: "Mar", ppg: 24.6, rpg: 4.6, apg: 5.2, fgPct: 46.2 },
    { month: "Apr", ppg: 25.1, rpg: 4.7, apg: 5.3, fgPct: 46.6 },
  ],
  // KD
  9: [
    { month: "Oct", ppg: 23.4, rpg: 6.1, apg: 3.8, fgPct: 50.4 },
    { month: "Nov", ppg: 25.1, rpg: 6.4, apg: 4.0, fgPct: 51.8 },
    { month: "Dec", ppg: 26.4, rpg: 6.7, apg: 4.1, fgPct: 52.4 },
    { month: "Jan", ppg: 27.8, rpg: 6.9, apg: 4.3, fgPct: 52.9 },
    { month: "Feb", ppg: 28.4, rpg: 7.0, apg: 4.4, fgPct: 52.8 },
    { month: "Mar", ppg: 27.1, rpg: 6.8, apg: 4.2, fgPct: 52.8 },
    { month: "Apr", ppg: 27.6, rpg: 6.9, apg: 4.3, fgPct: 53.1 },
  ],
  // Mitchell
  10: [
    { month: "Oct", ppg: 22.4, rpg: 4.6, apg: 5.2, fgPct: 45.8 },
    { month: "Nov", ppg: 24.1, rpg: 4.9, apg: 5.5, fgPct: 46.9 },
    { month: "Dec", ppg: 25.4, rpg: 5.1, apg: 5.7, fgPct: 47.6 },
    { month: "Jan", ppg: 26.8, rpg: 5.2, apg: 5.9, fgPct: 48.1 },
    { month: "Feb", ppg: 27.4, rpg: 5.3, apg: 6.0, fgPct: 47.9 },
    { month: "Mar", ppg: 26.1, rpg: 5.1, apg: 5.8, fgPct: 47.9 },
    { month: "Apr", ppg: 26.6, rpg: 5.2, apg: 5.9, fgPct: 48.2 },
  ],
};

// Distinct colors for comparison mode (up to 4 players)
export const COMPARISON_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

export const POSITION_COLORS: Record<string, string> = {
  PG: "#3B82F6",
  SG: "#8B5CF6",
  SF: "#10B981",
  PF: "#F59E0B",
  C: "#EF4444",
};
