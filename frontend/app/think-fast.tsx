import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PillButton from '../src/components/PillButton';
import ScreenHeader from '../src/components/ScreenHeader';
import { QuizQuestion, getQuestionsForField } from '../src/data/quizQuestions';
import { getScientist, getScientistsByField } from '../src/data/scientists';
import { useAppState } from '../src/state/AppState';
import { colors, fieldEmoji, fields, radii, spacing, typography } from '../src/theme';

const THEMES = fields.filter((f) => getScientistsByField(f.id).length > 0);
const COUNTS = [10, 20, 30];
const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
  { id: 'mixed', label: 'Mixed' },
] as const;
const TIMES = [10, 15, 20, 25, 30];
const MAX_PLAYERS = [2, 3, 4];
const BOT_POOL = ['Rahul', 'Aryan', 'Priya', 'Diya', 'Kabir', 'Isha', 'Vivaan', 'Meera'];
const DIFF_FACTOR: Record<string, number> = { easy: 0.85, medium: 0.65, hard: 0.45 };

type Difficulty = (typeof DIFFICULTIES)[number]['id'];

type Player = {
  name: string;
  isHost: boolean;
  isBot: boolean;
  ready: boolean;
  joined: boolean;
  score: number;
  correctCount: number;
  timeSum: number;
  fastestTime: number | null;
  roundAnswered: boolean;
  roundCorrect: boolean;
  roundPoints: number;
};

type Phase = 'setup' | 'lobby' | 'countdown' | 'question' | 'reveal' | 'final' | 'review';

function pointsFor(correct: boolean, timeTaken: number, timePerQ: number): number {
  if (!correct) return 0;
  if (timeTaken <= timePerQ * 0.33) return 100;
  if (timeTaken <= timePerQ * 0.66) return 90;
  return 80;
}

function chipStyle(active: boolean) {
  return {
    backgroundColor: active ? 'rgba(139,123,255,0.16)' : colors.surface,
    borderColor: active ? 'rgba(139,123,255,0.45)' : colors.hairlineStrong,
  };
}
function chipTextStyle(active: boolean) {
  return { color: active ? '#C6BEFF' : colors.textOnDark };
}

export default function ThinkFastChallenge() {
  const { addXp, recordTfChallenge } = useAppState();

  const [phase, setPhase] = useState<Phase>('setup');
  const [themeId, setThemeId] = useState(THEMES[0]?.id ?? 'physics');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [timePerQ, setTimePerQ] = useState(20);
  const [maxPlayers, setMaxPlayers] = useState(4);

  const [code, setCode] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [countdownN, setCountdownN] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [missed, setMissed] = useState<{ question: QuizQuestion; selectedIndex: number | null }[]>([]);
  const [reviewOpen, setReviewOpen] = useState<Record<number, boolean>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lobbyTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const countdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks which round is actually live so a bot-answer or timeout callback
  // scheduled for an old round can't fire late and corrupt the next round's
  // state (matches the design's own qIndex/phase guard on bot callbacks).
  const activeQIndexRef = useRef(0);
  const activePhaseRef = useRef<Phase>('setup');
  useEffect(() => {
    activePhaseRef.current = phase;
  }, [phase]);

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownTimeoutRef.current) clearTimeout(countdownTimeoutRef.current);
    botTimeoutsRef.current.forEach(clearTimeout);
    lobbyTimeoutsRef.current.forEach(clearTimeout);
    botTimeoutsRef.current = [];
    lobbyTimeoutsRef.current = [];
  };

  useEffect(() => clearAllTimers, []);

  // ── Setup → Lobby ──
  const createChallenge = () => {
    clearAllTimers();
    const newCode = `CM-${Math.floor(10000 + Math.random() * 90000)}`;
    const shuffledBots = [...BOT_POOL].sort(() => Math.random() - 0.5).slice(0, maxPlayers - 1);
    const initialPlayers: Player[] = [
      {
        name: 'You',
        isHost: true,
        isBot: false,
        ready: true,
        joined: true,
        score: 0,
        correctCount: 0,
        timeSum: 0,
        fastestTime: null,
        roundAnswered: false,
        roundCorrect: false,
        roundPoints: 0,
      },
      ...shuffledBots.map((name) => ({
        name,
        isHost: false,
        isBot: true,
        ready: false,
        joined: false,
        score: 0,
        correctCount: 0,
        timeSum: 0,
        fastestTime: null,
        roundAnswered: false,
        roundCorrect: false,
        roundPoints: 0,
      })),
    ];
    setCode(newCode);
    setPlayers(initialPlayers);
    setMissed([]);
    setReviewOpen({});
    setPhase('lobby');

    shuffledBots.forEach((name, i) => {
      lobbyTimeoutsRef.current.push(
        setTimeout(() => {
          setPlayers((prev) => prev.map((p) => (p.name === name ? { ...p, joined: true } : p)));
        }, 500 + i * 400),
      );
      lobbyTimeoutsRef.current.push(
        setTimeout(() => {
          setPlayers((prev) => prev.map((p) => (p.name === name ? { ...p, joined: true, ready: true } : p)));
        }, 1300 + i * 500),
      );
    });
  };

  const allReady = players.length > 0 && players.every((p) => p.ready);

  const copyLink = async () => {
    await Clipboard.setStringAsync(`curiousminds.app/join/${code}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join my Curious Minds Think Fast Challenge! Code: ${code} — curiousminds.app/join/${code}`,
    );
    Linking.openURL(`https://wa.me/?text=${text}`).catch(() => {});
  };

  // ── Lobby → Countdown → Question ──
  const beginQuestion = (index: number, questionSet: QuizQuestion[], currentPlayers: Player[]) => {
    clearAllTimers();
    activeQIndexRef.current = index;
    activePhaseRef.current = 'question';
    setPhase('question');
    setQIndex(index);
    setTimeLeft(timePerQ);
    setSelected(null);
    setAnswered(false);
    setPlayers((prev) => prev.map((p) => ({ ...p, roundAnswered: false, roundCorrect: false, roundPoints: 0 })));

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => resolveTimeout(index, questionSet), 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    const q = questionSet[index];
    const diffFactor = DIFF_FACTOR[q?.difficulty ?? 'medium'] ?? 0.6;
    currentPlayers.forEach((p) => {
      if (!p.isBot) return;
      const skill = 0.75 + Math.random() * 0.5;
      const willBeCorrect = Math.random() < Math.min(0.95, diffFactor * skill);
      const answerTime = Math.min(timePerQ - 0.5, 1.5 + Math.random() * (timePerQ - 2));
      const id = setTimeout(() => {
        if (activeQIndexRef.current !== index || activePhaseRef.current !== 'question') return;
        recordAnswer(p.name, willBeCorrect, answerTime);
      }, answerTime * 1000);
      botTimeoutsRef.current.push(id);
    });
  };

  const recordAnswer = (name: string, correct: boolean, timeTaken: number) => {
    const points = pointsFor(correct, timeTaken, timePerQ);
    setPlayers((prev) =>
      prev.map((p) =>
        p.name !== name
          ? p
          : {
              ...p,
              roundAnswered: true,
              roundCorrect: correct,
              roundPoints: points,
              score: p.score + points,
              correctCount: p.correctCount + (correct ? 1 : 0),
              timeSum: p.timeSum + (correct ? timeTaken : 0),
              fastestTime: correct ? (p.fastestTime == null ? timeTaken : Math.min(p.fastestTime, timeTaken)) : p.fastestTime,
            },
      ),
    );
  };

  const finishRound = () => {
    clearAllTimers();
    setTimeout(() => setPhase('reveal'), 400);
  };

  const selectAnswer = (idx: number) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.max(0.5, timePerQ - timeLeft);
    const q = questions[qIndex];
    const correct = idx === q.correct;
    setSelected(idx);
    setAnswered(true);
    recordAnswer('You', correct, timeTaken);
    if (!correct) setMissed((prev) => [...prev, { question: q, selectedIndex: idx }]);
    setTimeout(finishRound, 700);
  };

  const resolveTimeout = (index: number, questionSet: QuizQuestion[]) => {
    if (activeQIndexRef.current !== index || activePhaseRef.current !== 'question') return;
    setAnswered((wasAnswered) => {
      if (wasAnswered) return wasAnswered;
      const q = questionSet[index];
      setSelected(null);
      recordAnswer('You', false, timePerQ);
      setMissed((prev) => [...prev, { question: q, selectedIndex: null }]);
      finishRound();
      return true;
    });
  };

  const startChallenge = () => {
    if (!allReady) return;
    const pool = getQuestionsForField(themeId, difficulty);
    const source = pool.length > 0 ? pool : getQuestionsForField(themeId, 'mixed');
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    const built: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) built.push(shuffled[i % shuffled.length]);
    setQuestions(built);
    setPhase('countdown');
    setCountdownN(3);

    const tick = (n: number) => {
      setCountdownN(n);
      if (n > 0) {
        countdownTimeoutRef.current = setTimeout(() => tick(n - 1), 700);
      } else {
        countdownTimeoutRef.current = setTimeout(() => {
          setPlayers((current) => {
            beginQuestion(0, built, current);
            return current;
          });
        }, 500);
      }
    };
    tick(3);
  };

  const nextQuestion = () => {
    const isLast = qIndex >= questions.length - 1;
    if (isLast) {
      finishChallenge();
      return;
    }
    setPlayers((current) => {
      beginQuestion(qIndex + 1, questions, current);
      return current;
    });
  };

  const finishChallenge = () => {
    clearAllTimers();
    const you = players.find((p) => !p.isBot);
    addXp(Math.round((you?.score ?? 0) / 10));
    recordTfChallenge(Math.round((you?.score ?? 0) / 10), you?.timeSum ?? 0, you?.correctCount ?? 0);
    setPhase('final');
  };

  const playAgain = () => {
    createChallenge();
  };

  const exitToHub = () => {
    clearAllTimers();
    router.back();
  };

  // ── Derived view data ──
  const you = players.find((p) => !p.isBot);
  const question = questions[qIndex];
  const questionScientist = question ? getScientist(question.scientist_id) : undefined;
  const timerPct = Math.round((timeLeft / timePerQ) * 100);
  const timerColor = timeLeft <= timePerQ * 0.25 ? colors.error : timeLeft <= timePerQ * 0.5 ? colors.goldText : colors.success;
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];
  const champion = sortedPlayers[0];
  const starCount = champion ? Math.max(1, Math.min(5, Math.round((champion.score / (questions.length * 100 || 1)) * 5))) : 0;
  const championStars = '⭐'.repeat(starCount) + '☆'.repeat(5 - starCount);

  const qrCells = useMemo(() => {
    return Array.from({ length: 64 }, (_, i) => {
      const r = Math.floor(i / 8);
      const c = i % 8;
      const isFrame = r === 0 || r === 7 || c === 0 || c === 7 || (r < 3 && c < 3) || (r < 3 && c > 4) || (r > 4 && c < 3);
      const on = isFrame ? (r + c) % 3 !== 0 : Math.random() > 0.55;
      return on;
    });
  }, [code]);

  const headerTitle =
    phase === 'setup'
      ? 'Think Fast Challenge'
      : phase === 'lobby'
        ? 'Challenge Lobby'
        : phase === 'final'
          ? 'Final Results'
          : phase === 'review'
            ? 'Learn from Mistakes'
            : 'Think Fast Challenge';

  return (
    <View style={styles.container}>
      <ScreenHeader title={headerTitle} onBack={exitToHub} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {phase === 'setup' && (
          <View style={{ gap: spacing.xl }}>
            <View style={styles.infoCard}>
              <LinearGradient colors={colors.purpleGradient} style={StyleSheet.absoluteFill} />
              <Text style={styles.infoTitle}>🎯 Challenge Friends</Text>
              <Text style={styles.infoBody}>
                Set up a live quiz race. Everyone gets the same questions at the same time — speed and
                accuracy both score points.
              </Text>
            </View>

            <View>
              <Text style={styles.eyebrow}>Theme</Text>
              <View style={{ gap: spacing.xs }}>
                {THEMES.map((t) => {
                  const active = t.id === themeId;
                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => setThemeId(t.id)}
                      style={[styles.themeRow, chipStyle(active)]}
                    >
                      <Text style={styles.themeEmoji}>{fieldEmoji[t.id] ?? '📖'}</Text>
                      <Text style={[styles.themeText, chipTextStyle(active)]}>{t.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.eyebrow}>Number of questions</Text>
              <View style={styles.chipRow}>
                {COUNTS.map((n) => (
                  <Pressable key={n} onPress={() => setCount(n)} style={[styles.chip, chipStyle(n === count)]}>
                    <Text style={[styles.chipText, chipTextStyle(n === count)]}>{n}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.eyebrow}>Difficulty</Text>
              <View style={[styles.chipRow, { flexWrap: 'wrap' }]}>
                {DIFFICULTIES.map((d) => (
                  <Pressable
                    key={d.id}
                    onPress={() => setDifficulty(d.id)}
                    style={[styles.chip, chipStyle(d.id === difficulty)]}
                  >
                    <Text style={[styles.chipText, chipTextStyle(d.id === difficulty)]}>{d.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.eyebrow}>Time per question</Text>
              <View style={styles.chipRow}>
                {TIMES.map((n) => (
                  <Pressable key={n} onPress={() => setTimePerQ(n)} style={[styles.chip, chipStyle(n === timePerQ)]}>
                    <Text style={[styles.chipTextSm, chipTextStyle(n === timePerQ)]}>{n}s</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.eyebrow}>Max players</Text>
              <View style={styles.chipRow}>
                {MAX_PLAYERS.map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => setMaxPlayers(n)}
                    style={[styles.chip, chipStyle(n === maxPlayers)]}
                  >
                    <Text style={[styles.chipText, chipTextStyle(n === maxPlayers)]}>{n} players</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable onPress={createChallenge} style={styles.gradientButtonWrap}>
              <LinearGradient colors={['#8B7BFF', '#5C4CD9']} style={StyleSheet.absoluteFill} />
              <Text style={styles.gradientButtonText}>🎯 Generate Challenge</Text>
            </Pressable>
          </View>
        )}

        {phase === 'lobby' && (
          <View style={{ alignItems: 'center', gap: spacing.xl }}>
            <Text style={styles.eyebrow}>Challenge Code</Text>
            <Text style={styles.code}>{code}</Text>
            <View style={styles.qrBox}>
              {qrCells.map((on, i) => (
                <View key={i} style={{ backgroundColor: on ? '#150F3E' : '#F6F4FF' }} />
              ))}
            </View>
            <View style={styles.shareRow}>
              <Pressable onPress={shareWhatsApp} style={styles.whatsAppButton}>
                <Text style={styles.whatsAppText}>💬 WhatsApp</Text>
              </Pressable>
              <Pressable onPress={copyLink} style={styles.copyButton}>
                <Text style={styles.copyText}>{linkCopied ? '✓ Copied' : '🔗 Copy Link'}</Text>
              </Pressable>
            </View>

            <View style={{ width: '100%' }}>
              <Text style={styles.eyebrow}>Players</Text>
              <View style={{ gap: spacing.xs }}>
                {players.map((p) => (
                  <View key={p.name} style={styles.playerRow}>
                    <Text style={styles.playerMark}>{!p.joined ? '⬜' : p.ready ? '✅' : '⬜'}</Text>
                    <Text style={styles.playerName}>
                      {p.name}
                      {p.isHost ? ' (Host)' : ''}
                    </Text>
                    <Text
                      style={[
                        styles.playerStatus,
                        { color: !p.joined ? colors.textSecondary : p.ready ? colors.success : colors.textSecondary },
                      ]}
                    >
                      {!p.joined ? 'Joining...' : p.ready ? 'Ready' : 'Not ready'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Pressable
              onPress={startChallenge}
              disabled={!allReady}
              style={[styles.gradientButtonWrap, { width: '100%' }, !allReady && styles.disabledButton]}
            >
              {allReady && <LinearGradient colors={['#8B7BFF', '#5C4CD9']} style={StyleSheet.absoluteFill} />}
              <Text style={[styles.gradientButtonText, !allReady && { color: colors.textMuted }]}>
                {allReady ? '▶ Start Challenge' : 'Waiting for players...'}
              </Text>
            </Pressable>
          </View>
        )}

        {phase === 'countdown' && (
          <View style={styles.countdownWrap}>
            <Text style={styles.countdownNumber}>{countdownN > 0 ? String(countdownN) : 'GO!'}</Text>
            <Text style={styles.countdownSub}>Get ready...</Text>
          </View>
        )}

        {phase === 'question' && question && (
          <View style={{ gap: spacing.md }}>
            <View style={styles.spaceBetweenRow}>
              <Text style={styles.questionPosition}>
                Question {qIndex + 1} of {questions.length}
              </Text>
              <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${timerPct}%`, backgroundColor: timerColor }]} />
            </View>
            <View style={styles.playerChipsRow}>
              {players.map((p) => (
                <View key={p.name} style={styles.playerChip}>
                  <Text style={{ color: p.roundAnswered ? colors.success : colors.textSecondary, fontFamily: typography.fontFamily.bodyBold, fontSize: typography.size.microLabel }}>
                    {p.name} {p.roundAnswered ? '✓' : '…'}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={{ gap: spacing.sm }}>
              {question.options.map((option, i) => {
                const isSelected = selected === i;
                const isCorrect = i === question.correct;
                let bg: string = colors.surface;
                let border: string = colors.hairlineStrong;
                let dotBg = 'transparent';
                let dotBorder = 'rgba(255,255,255,0.25)';
                let mark = '';
                let textColor: string = colors.textOnDark;
                if (answered) {
                  if (isCorrect) {
                    bg = 'rgba(47,217,160,0.14)';
                    border = 'rgba(47,217,160,0.5)';
                    dotBg = colors.success;
                    dotBorder = colors.success;
                    mark = '✓';
                    textColor = colors.success;
                  } else if (isSelected) {
                    bg = 'rgba(255,92,138,0.14)';
                    border = 'rgba(255,92,138,0.5)';
                    dotBg = colors.error;
                    dotBorder = colors.error;
                    mark = '✕';
                    textColor = colors.error;
                  }
                }
                return (
                  <Pressable
                    key={i}
                    onPress={() => selectAnswer(i)}
                    style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                  >
                    <View style={[styles.optionDot, { backgroundColor: dotBg, borderColor: dotBorder }]}>
                      <Text style={styles.optionMark}>{mark}</Text>
                    </View>
                    <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {phase === 'reveal' && you && question && (
          <View style={{ gap: spacing.md }}>
            <View
              style={[
                styles.resultBanner,
                {
                  backgroundColor: you.roundCorrect ? 'rgba(47,217,160,0.12)' : 'rgba(255,92,138,0.12)',
                  borderColor: you.roundCorrect ? 'rgba(47,217,160,0.35)' : 'rgba(255,92,138,0.35)',
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{you.roundCorrect ? '🎉' : '💡'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultLabel, { color: you.roundCorrect ? colors.success : colors.error }]}>
                  {you.roundCorrect ? 'Correct!' : you.roundAnswered ? 'Not quite' : "Time's up"}
                </Text>
                <Text style={styles.resultPoints}>+{you.roundPoints} points</Text>
              </View>
            </View>

            <View style={styles.explanationCard}>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
            {questionScientist && (
              <View style={styles.factCard}>
                <Text style={styles.factTitle}>💡 Did You Know?</Text>
                <Text style={styles.factText}>{questionScientist.fun_fact}</Text>
              </View>
            )}

            <View>
              <Text style={styles.eyebrow}>🏆 Live Scoreboard</Text>
              <View style={{ gap: spacing.xs }}>
                {sortedPlayers.map((p, i) => (
                  <View
                    key={p.name}
                    style={[
                      styles.leaderRow,
                      {
                        backgroundColor: p.isHost ? 'rgba(139,123,255,0.12)' : colors.surface,
                        borderColor: p.isHost ? 'rgba(139,123,255,0.4)' : colors.hairline,
                      },
                    ]}
                  >
                    <Text style={styles.leaderMedal}>{medals[i] ?? `${i + 1}.`}</Text>
                    <Text style={styles.leaderName}>{p.name}</Text>
                    <Text style={styles.leaderScore}>{p.score}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Pressable onPress={nextQuestion} style={styles.gradientButtonWrap}>
              <LinearGradient colors={['#8B7BFF', '#5C4CD9']} style={StyleSheet.absoluteFill} />
              <Text style={styles.gradientButtonText}>
                {qIndex >= questions.length - 1 ? 'See Final Results' : 'Next Question →'}
              </Text>
            </Pressable>
          </View>
        )}

        {phase === 'final' && champion && (
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <Text style={styles.eyebrow}>🏆 Curious Challenge Champion</Text>
            <View style={styles.championCircle}>
              <LinearGradient colors={['#8B7BFF', '#5C4CD9']} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 22 }}>🥇</Text>
            </View>
            <Text style={styles.championName}>
              {champion.name}
              {champion.isHost && champion.name !== 'You' ? ' (You)' : ''}
            </Text>
            <Text style={styles.championScore}>{champion.score} Points</Text>
            <Text style={{ fontSize: 16 }}>{championStars}</Text>

            <View style={styles.statGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {you?.correctCount ?? 0} / {questions.length}
                </Text>
                <Text style={styles.statLabel}>Correct Answers</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.blue }]}>
                  {you && you.correctCount > 0 ? (you.timeSum / you.correctCount).toFixed(1) : '0.0'}s
                </Text>
                <Text style={styles.statLabel}>Average Time</Text>
              </View>
              <View style={[styles.statCard, { width: '100%' }]}>
                <Text style={[styles.statValue, { color: colors.orange }]}>
                  {you?.fastestTime != null ? you.fastestTime.toFixed(1) : '—'}s
                </Text>
                <Text style={styles.statLabel}>Fastest Answer</Text>
              </View>
            </View>

            <View style={styles.badgePill}>
              <Text style={{ fontSize: 20 }}>⚡</Text>
              <Text style={styles.badgePillText}>Badge unlocked: Quick Thinker</Text>
            </View>

            {missed.length > 0 && (
              <Pressable onPress={() => setPhase('review')} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>📘 Learn from Your Mistakes ({missed.length})</Text>
              </Pressable>
            )}
            <Pressable onPress={playAgain} style={styles.gradientButtonWrap}>
              <LinearGradient colors={['#8B7BFF', '#5C4CD9']} style={StyleSheet.absoluteFill} />
              <Text style={styles.gradientButtonText}>Play Again</Text>
            </Pressable>
            <Pressable onPress={exitToHub}>
              <Text style={styles.backLink}>Back to Quiz Zone</Text>
            </Pressable>
          </View>
        )}

        {phase === 'review' && (
          <View style={{ gap: spacing.md }}>
            <Text style={styles.eyebrow}>Questions You Missed</Text>
            {missed.map((m, i) => {
              const open = !!reviewOpen[i];
              const scientist = getScientist(m.question.scientist_id);
              return (
                <Pressable
                  key={i}
                  onPress={() => setReviewOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
                  style={styles.reviewCard}
                >
                  <View style={styles.spaceBetweenRow}>
                    <Text style={styles.reviewTitle}>Question {i + 1}</Text>
                    <Text style={styles.reviewChevron}>{open ? '▲' : '▼'}</Text>
                  </View>
                  <Text style={styles.reviewText}>{m.question.question}</Text>
                  {open && (
                    <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
                      <Text style={styles.reviewCorrect}>
                        ✅ Correct answer: {m.question.options[m.question.correct]}
                      </Text>
                      <Text style={styles.reviewText}>{m.question.explanation}</Text>
                      {scientist && (
                        <View style={styles.factCard}>
                          <Text style={styles.factTitle}>💡 Did You Know?</Text>
                          <Text style={styles.factText}>{scientist.fun_fact}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
            <PillButton label="Done" onPress={exitToHub} style={{ marginTop: spacing.xs }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: spacing.sm,
  },
  infoCard: {
    borderRadius: radii.cardSmall + 4,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  infoTitle: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitle - 1,
    color: colors.textPrimary,
  },
  infoBody: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardTiny,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  themeEmoji: {
    fontSize: 18,
  },
  themeText: {
    flex: 1,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.cardTiny,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
  },
  chipText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
  },
  chipTextSm: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
  },
  gradientButtonWrap: {
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientButtonText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  code: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle + 6,
    color: colors.purple,
    letterSpacing: 1,
  },
  qrBox: {
    width: 150,
    height: 150,
    borderRadius: radii.cardTiny + 2,
    backgroundColor: colors.textPrimary,
    padding: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shareRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  whatsAppButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(47,217,160,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(47,217,160,0.35)',
  },
  whatsAppText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.success,
  },
  copyButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  copyText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardTiny,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  playerMark: {
    fontSize: 16,
  },
  playerName: {
    flex: 1,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
  },
  playerStatus: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.micro,
  },
  countdownWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: 80,
  },
  countdownNumber: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: 72,
    color: colors.purple,
  },
  countdownSub: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  spaceBetweenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionPosition: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
  },
  timerText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitleSm + 2,
  },
  progressTrack: {
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  playerChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  playerChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  questionText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.sectionTitle - 2,
    color: colors.textPrimary,
    lineHeight: 27,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
  },
  optionDot: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionMark: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: colors.onGold,
  },
  optionText: {
    flex: 1,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.body,
    lineHeight: 20,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
  },
  resultLabel: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
  },
  resultPoints: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
  },
  explanationCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
  },
  explanationText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    lineHeight: 21,
  },
  factCard: {
    backgroundColor: 'rgba(231,185,60,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    borderRadius: radii.cardSmall,
    padding: spacing.md,
    gap: 4,
  },
  factTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.goldText,
  },
  factText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    lineHeight: 21,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardSmall,
    padding: spacing.sm,
  },
  leaderMedal: {
    fontSize: 16,
    width: 22,
  },
  leaderName: {
    flex: 1,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
  },
  leaderScore: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.purple,
  },
  championCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  championName: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.headerLg + 2,
    color: colors.textPrimary,
  },
  championScore: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statSmall,
    color: colors.goldText,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardSmall,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitle + 2,
  },
  statLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  badgePillText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.goldText,
  },
  secondaryButton: {
    width: '100%',
    alignItems: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginTop: 4,
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
  },
  backLink: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    textDecorationLine: 'underline',
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
  },
  reviewTitle: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.textPrimary,
  },
  reviewChevron: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.body,
    color: colors.textSecondary,
  },
  reviewText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    marginTop: 6,
    lineHeight: 19,
  },
  reviewCorrect: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.success,
  },
});
