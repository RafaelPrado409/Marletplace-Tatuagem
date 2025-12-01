import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: "easeOut" },
  }),
};

const cardHover = "transition transform hover:-translate-y-1 hover:shadow-md";

export function LandingPage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white">
        {/* glow */}
        <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        {/* grid texture */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative px-8 py-14 md:px-12 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-3">
              Marketplace para Tatuagem
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Encontre o estúdio ideal e agende sua próxima tattoo com
              confiança.
            </h1>

            <p className="text-base md:text-lg text-white/80 mt-4">
              Explore portfólios reais, compare estilos, veja avaliações e
              marque sua sessão em poucos cliques.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                to="/artists"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-slate-100 transition"
              >
                Ver Artistas
              </Link>

              <Link
                to="/studios"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/25 text-white font-semibold hover:bg-white/10 transition"
              >
                Ver Estúdios
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
              {[
                "Realismo",
                "Old School",
                "Pontilhismo",
                "Aquarela",
                "Anime",
              ].map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-white/10">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* HERO CARD */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            className="w-full md:w-[420px] bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 bg-white/10 rounded-xl p-4">
                <p className="text-sm text-white/70">Destaque da semana</p>
                <p className="text-lg font-semibold mt-1">Luna Prado</p>
                <p className="text-xs text-white/60">
                  Realismo • Old School • RJ
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold">+120</p>
                <p className="text-xs text-white/70">Artistas</p>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold">+80</p>
                <p className="text-xs text-white/70">Estúdios</p>
              </div>

              <div className="col-span-2 bg-white/10 rounded-xl p-4">
                <p className="text-xs text-white/70 mb-2">Agendamento fácil</p>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Escolha data</span>
                  <span>→</span>
                  <span>Confirme horário</span>
                  <span>→</span>
                  <span>Pronto!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MOCK PRINTS / PREVIEWS */}
      <section className="space-y-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="flex items-end justify-between"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Uma experiência feita para quem ama tattoo
          </h2>
          <p className="text-sm text-slate-500">explore com segurança</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* “print” 1 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={fadeUp}
            className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${cardHover}`}
          >
            <div className="h-40 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 text-sm">
              Preview — Lista de Artistas
            </div>
            <p className="mt-3 text-sm font-semibold">Filtros inteligentes</p>
            <p className="text-xs text-slate-600 mt-1">
              Busque por cidade, estilo e portfólio em segundos.
            </p>
          </motion.div>

          {/* “print” 2 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
            className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${cardHover}`}
          >
            <div className="h-40 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 text-sm">
              Preview — Detalhe do Artista
            </div>
            <p className="mt-3 text-sm font-semibold">Portfólios reais</p>
            <p className="text-xs text-slate-600 mt-1">
              Veja o estilo do artista antes de escolher.
            </p>
          </motion.div>

          {/* “print” 3 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={2}
            variants={fadeUp}
            className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${cardHover}`}
          >
            <div className="h-40 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 text-sm">
              Preview — Agendamento
            </div>
            <p className="mt-3 text-sm font-semibold">Agende sem dor</p>
            <p className="text-xs text-slate-600 mt-1">
              Escolha data, horário e envie a solicitação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="space-y-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="flex items-end justify-between"
        >
          <h2 className="text-2xl md:text-3xl font-bold">Como funciona</h2>
          <p className="text-sm text-slate-500">do achado ao agendamento</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Descubra artistas",
              desc: "Busque por cidade, estilo e portfólio. Veja trabalhos reais.",
            },
            {
              step: "02",
              title: "Compare estúdios",
              desc: "Conheça localização, estrutura e perfil dos artistas.",
            },
            {
              step: "03",
              title: "Agende sua sessão",
              desc: "Escolha data e horário e envie a solicitação de forma rápida.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              variants={fadeUp}
              className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${cardHover}`}
            >
              <p className="text-xs font-bold text-slate-400">{item.step}</p>
              <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Por que usar o marketplace?
          </h2>
          <p className="text-slate-600">
            Uma plataforma centralizada para você escolher com segurança,
            transparência e praticidade.
          </p>

          <ul className="space-y-3 text-sm text-slate-700">
            {[
              "Portfólios completos e organizados.",
              "Busca inteligente por estilo e localização.",
              "Agendamento rápido e histórico de sessões.",
              "Mais visibilidade para artistas e estúdios.",
            ].map((b) => (
              <li key={b} className="flex gap-2">
                <span>✅</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-slate-800 transition"
            >
              Criar conta grátis
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-sm font-semibold">Estilos populares</p>
              <p className="text-xs text-slate-600 mt-1">
                Realismo, Old School, Fine Line, Anime…
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-sm font-semibold">Cidades</p>
              <p className="text-xs text-slate-600 mt-1">
                RJ, SP, BH, Curitiba, Recife…
              </p>
            </div>
            <div className="col-span-2 rounded-2xl bg-slate-100 p-4">
              <p className="text-sm font-semibold">Agendamento simples</p>
              <p className="text-xs text-slate-600 mt-1">
                Em poucos cliques, sem troca de mensagens infinita.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-black text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Pronto para sua próxima tattoo?
          </h2>
          <p className="text-white/75 mt-2">
            Encontre artistas incríveis e agende com confiança.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/artists"
            className="px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-slate-100 transition"
          >
            Explorar artistas
          </Link>
          <Link
            to="/studios"
            className="px-5 py-3 rounded-xl border border-white/25 text-white font-semibold hover:bg-white/10 transition"
          >
            Ver estúdios
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-slate-500 pb-8">
        © {new Date().getFullYear()} Marketplace Tattoo • Projeto TCC
      </footer>
    </div>
  );
}
