import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard" : "/register";

  return (
    <div className="w-full relative -mt-[100px] pt-[100px]">
      {}
      <section className="relative pt-2xl pb-2xl md:pt-[180px] overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-tertiary/10 blur-[100px] rounded-full -z-10"></div>

        <div className="max-w-container_max mx-auto px-lg text-center">
          <div className="inline-flex items-center gap-sm bg-surface-container-low px-md py-xs rounded-full border border-outline-variant/30 mb-lg">
            <span className="relative flex h-2 w-2">
              <span className="pulse-halo absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">Live insights active</span>
          </div>

          <h1 className="font-display-2xl text-display-lg md:text-display-2xl text-on-surface mb-md leading-tight">
            Turn opinions into <span className="text-primary italic">decisions</span> instantly
          </h1>

          <p className="text-body-lg text-on-surface-variant max-w-[640px] mx-auto mb-2xl">
            Harness the power of real-time intelligence with Voxly's advanced feedback engine. Capture, analyze, and act on data before it goes cold.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-md mb-2xl">
            <Link to={ctaLink} className="accent-gradient text-on-primary px-2xl py-md rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Link>
            <button className="flex items-center gap-xs text-on-surface font-bold hover:text-primary transition-colors group">
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">play_circle</span>
              Watch Demo
            </button>
          </div>

          {}
          <div className="relative max-w-[900px] mx-auto mt-lg">
            {}
            <div className="absolute -top-12 -left-8 md:flex hidden glass p-md rounded-lg voxly-glow items-center gap-md z-20">
              <div className="bg-primary-container p-sm rounded-full">
                <span className="material-symbols-outlined text-on-primary-container">trending_up</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Peak engagement</p>
                <p className="text-xs text-on-surface-variant">+24% from yesterday</p>
              </div>
            </div>

            <div className="absolute bottom-12 -right-12 md:flex hidden glass p-md rounded-lg voxly-glow items-center gap-md z-20">
              <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwQfuPG60y5yDbSLU6mZWeWVGFDMh5BkOxzIDwfprwEg10M5Zhon8hu0UxVlkyektY42oOzkIYZ3pWVF3ZeoXdj2PYfUwjSuONgETL2VvvmlYYNn6qqrmJtAYY9KaoQsCJHX84pUk0The70Bj2MBSviVFaGSwwWpJW2j9MIMpkOoJ25ATyZgcLFdNwkGQpdHFjTA1p2_q9opPX7yti0WaSQlYZlheWzgQEQHLAipysS45TsP6ILdkSssFiDm57iCV-QNVpNLKn5Ig"/>
              <div className="text-left">
                <p className="font-bold text-sm">New Poll Created</p>
                <p className="text-xs text-on-surface-variant">"Q3 Product Roadmap Priorities"</p>
              </div>
            </div>

            <div className="glass p-lg rounded-lg voxly-glow border border-outline-variant/30 relative overflow-hidden">
              <div className="flex justify-between items-center mb-xl">
                <div className="text-left">
                  <h3 className="font-headline-md text-headline-md">Live Pulse: Product Direction</h3>
                  <p className="text-on-surface-variant text-body-sm">482 active participants • Ends in 2h 15m</p>
                </div>
                <div className="px-md py-xs bg-error-container text-on-error-container rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_manual_record</span> LIVE
                </div>
              </div>
              <div className="space-y-lg">
                <div className="space-y-sm">
                  <div className="flex justify-between text-body-sm font-bold">
                    <span>Advanced AI Features</span>
                    <span className="text-primary">64%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full brand-gradient rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
                <div className="space-y-sm opacity-70">
                  <div className="flex justify-between text-body-sm">
                    <span>Mobile App Refinement</span>
                    <span>21%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-outline rounded-full" style={{ width: '21%' }}></div>
                  </div>
                </div>
                <div className="space-y-sm opacity-70">
                  <div className="flex justify-between text-body-sm">
                    <span>Extended Community API</span>
                    <span>15%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-outline rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <div className="py-xl bg-background overflow-hidden border-y border-outline-variant/10 w-[100vw] relative left-1/2 -ml-[50vw]">
        <div className="marquee flex gap-2xl items-center">
          <div className="flex gap-2xl">
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">auto_graph</span> REAL-TIME ANALYTICS
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">security</span> ENTERPRISE GRADE
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">group_work</span> COLLABORATION FIRST
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">bolt</span> 100MS LATENCY
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">psychology</span> AI CLUSTERING
            </span>
          </div>
          {}
          <div className="flex gap-2xl">
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">auto_graph</span> REAL-TIME ANALYTICS
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">security</span> ENTERPRISE GRADE
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">group_work</span> COLLABORATION FIRST
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">bolt</span> 100MS LATENCY
            </span>
            <span className="text-on-surface-variant font-bold text-headline-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">psychology</span> AI CLUSTERING
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="w-[100vw] relative left-1/2 -ml-[50vw] bg-surface-container-low pt-2xl pb-2xl">
        <section className="max-w-container_max mx-auto px-lg">
          <div className="text-center mb-2xl">
          <h2 className="font-headline-xl text-headline-xl mb-md">How intelligence flows</h2>
          <p className="text-on-surface-variant max-w-[500px] mx-auto">From question to insight in three simple movements.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl relative">
          {}
          <div className="absolute top-[100px] left-[15%] right-[15%] hidden md:block border-t-2 border-dashed border-outline-variant/30"></div>

          <div className="text-center relative z-10 group">
            <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center mx-auto mb-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">edit_note</span>
            </div>
            <h3 className="font-bold text-xl mb-sm">Design &amp; Deploy</h3>
            <p className="text-on-surface-variant text-body-sm">Craft beautiful, high-conversion polls with our intuitive editor.</p>
          </div>

          <div className="text-center relative z-10 group">
            <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center mx-auto mb-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">hub</span>
            </div>
            <h3 className="font-bold text-xl mb-sm">Capture &amp; Stream</h3>
            <p className="text-on-surface-variant text-body-sm">Distribute across any channel and watch results stream in live.</p>
          </div>

          <div className="text-center relative z-10 group">
            <div className="w-20 h-20 bg-tertiary-container text-on-tertiary-container rounded-lg flex items-center justify-center mx-auto mb-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">insights</span>
            </div>
            <h3 className="font-bold text-xl mb-sm">Extract Meaning</h3>
            <p className="text-on-surface-variant text-body-sm">Our AI automatically clusters responses and identifies trends.</p>
          </div>
        </div>
      </section>

        {}
        <section className="max-w-container_max mx-auto px-lg mt-2xl">
          <div className="grid grid-cols-12 gap-lg auto-rows-[240px]">
          {}
          <div className="col-span-12 md:col-span-8 glass rounded-lg p-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-lg">
              <div>
                <h4 className="font-bold text-lg">Response Velocity</h4>
                <p className="text-sm text-on-surface-variant">Live streaming data feed</p>
              </div>
              <div className="text-tertiary text-2xl font-bold">+88%</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full px-lg">
              <div className="flex items-end gap-xs h-32">
                <div className="bg-primary/20 hover:bg-primary w-full h-[40%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[60%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[55%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[90%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[75%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[85%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[40%] rounded-t transition-all"></div>
                <div className="bg-primary/20 hover:bg-primary w-full h-[60%] rounded-t transition-all"></div>
              </div>
            </div>
          </div>
          {}
          <div className="col-span-12 md:col-span-4 bg-primary-container/20 glass rounded-lg p-lg flex flex-col justify-center">
            <div className="flex -space-x-3 mb-md">
              <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvJRQ-_bhKmSiUMDUNnn4Oji_ftSRY5ImjGKHsKot7rUQ6PtwvbZ4SUBhIZ00_-HnVmkKL1KRn0iubxxGP23Q_v8-07cPrnRxpA4eEYKmz_1YBAJ-kzM7klodnym5-6mx89iUdKS5oLdDovCysll0KZ6KJj7B2ESjRjnAnzUn0y3DRTU3trQG-W7NqHNoYyo6eIA7kXlBudRxcViMZCWXK8ebCjDOKn9fgZN2zJ0KK374wrgjNaUz3k6Vma1aOwvKfdDHmFf2skL0"/>
              <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR8R0BVN0nm_rl5wD7k1qLNZHVR5PG58jyrEMF06sSZWWxVMT0v0O91d4WvT-thI-rojKXUpzZZSrjJppR0ReI652uTCKSBxc-tNLlnK6ezWwW1h8m5Q8cfMb6jwZlHCJyGyAdjutpiCukP6rdd5y-3ca8kJ8xiBUvrTe5UB8ZVeGsW7kjvDCUL1lnfOiPaXvBNAp4_Qq3jQSWgNlcxQA5uVyVKLWNZCtr2CRo0J9qz9BV85_bMmda-N-J-IfUTQkH9A11yV8jZ18"/>
              <img alt="User 3" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDreyUCzHItzgc90FTapzAqx-8IXHARvD1CN0-jPLfPYxTMCqWAEER14Op3WJXkrhQoiiZk2sptM7vBkWK68Xl0x4WKh3r6Wc5gUnFr2tMl7UFDKWRbVsjOuRbfdblEVzYSfquiXhhNeEi5pzPaFV8A2IQZ6hcvoUfiHIilHhfyw2EeWgSWQ5Ze1DuTLLM0EP4WII4gUrttw7Q4vHiMJNLUzQLQjslkbh4zSO2CX5GpyaJiYcjl_oMHQLek9qt7U3yInTY4sXhpR2I"/>
              <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-surface flex items-center justify-center text-xs text-on-surface-variant">+12</div>
            </div>
            <h4 className="font-bold text-lg mb-xs">Role Based Access</h4>
            <p className="text-sm text-on-surface-variant">Control exactly who can view, edit, and publish within your team.</p>
          </div>
          {}
          <div className="col-span-12 md:col-span-4 glass rounded-lg p-lg flex flex-col justify-between">
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Election Clock</div>
            <div className="text-center py-md">
              <div className="text-4xl font-display-lg text-primary tracking-tight">04 : 12 : 59</div>
              <div className="text-[10px] text-on-surface-variant mt-1">HRS : MIN : SEC</div>
            </div>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-xs">Dynamic closing times active</span>
            </div>
          </div>
          {}
          <div className="col-span-12 md:col-span-5 glass rounded-lg p-lg flex flex-col gap-md">
            <h4 className="font-bold text-lg">Smart Routing</h4>
            <div className="space-y-sm">
              <div className="p-sm bg-surface-container-high rounded-md border border-outline-variant/20 flex justify-between items-center text-sm">
                <span>If Answered: Yes</span>
                <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                <span>Show: Section 2</span>
              </div>
              <div className="p-sm bg-surface-container-high rounded-md border border-outline-variant/20 flex justify-between items-center text-sm">
                <span>If Answered: No</span>
                <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                <span>End Poll</span>
              </div>
            </div>
          </div>
          {}
          <div className="col-span-12 md:col-span-3 glass rounded-lg p-lg flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-tertiary/20 flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-tertiary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="font-bold">Instant Deploy</div>
            <div className="text-xs text-on-surface-variant">Global edge propagation</div>
          </div>
          {}
          <div className="col-span-12 glass rounded-lg p-lg flex items-center justify-between">
            <div className="flex items-center gap-xl">
              <span className="material-symbols-outlined text-5xl text-primary/40">encrypted</span>
              <div>
                <h4 className="font-bold text-lg">Military Grade Data Integrity</h4>
                <p className="text-sm text-on-surface-variant">AES-256 encryption at rest and in transit. SOC2 Type II Compliant infrastructure.</p>
              </div>
            </div>
            <button className="hidden md:block px-lg py-sm border border-outline-variant rounded-full text-sm font-bold hover:bg-surface-variant transition-colors">Audit Security</button>
          </div>
          </div>
        </section>
      </div>

      {}
      <section className="py-2xl bg-background w-[100vw] relative left-1/2 -ml-[50vw]">
        <div className="max-w-container_max mx-auto px-lg">
          <div className="text-center mb-2xl">
            <h2 className="font-headline-xl text-headline-xl mb-md">See the pulse in action</h2>
            <p className="text-on-surface-variant">Try our real-time widget below. Votes update globally in milliseconds.</p>
          </div>
          <div className="max-w-[720px] mx-auto glass rounded-xl p-2xl voxly-glow border border-primary/20">
            <div className="text-center mb-xl">
              <span className="text-label-md font-label-md text-primary tracking-widest uppercase mb-sm block">Interactive Demo</span>
              <h3 className="font-headline-md text-headline-md">What's the most critical factor for choosing a feedback tool?</h3>
            </div>
            <div className="space-y-md">
              <button className="w-full text-left p-lg rounded-lg bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 transition-all flex justify-between items-center group">
                <span className="font-bold">Real-time Data Updates</span>
                <div className="flex items-center gap-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-on-surface-variant">42%</span>
                  <span className="material-symbols-outlined text-primary">radio_button_unchecked</span>
                </div>
              </button>
              <button className="w-full text-left p-lg rounded-lg bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 transition-all flex justify-between items-center group">
                <span className="font-bold">Beautiful User Experience</span>
                <div className="flex items-center gap-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-on-surface-variant">31%</span>
                  <span className="material-symbols-outlined text-primary">radio_button_unchecked</span>
                </div>
              </button>
              <button className="w-full text-left p-lg rounded-lg bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 transition-all flex justify-between items-center group">
                <span className="font-bold">AI Sentiment Analysis</span>
                <div className="flex items-center gap-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-on-surface-variant">27%</span>
                  <span className="material-symbols-outlined text-primary">radio_button_unchecked</span>
                </div>
              </button>
            </div>
            <div className="mt-xl text-center text-xs text-on-surface-variant">
              3,892 people have already voted in this demo.
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-2xl max-w-container_max mx-auto px-lg">
        <h2 className="font-headline-xl text-headline-xl text-center mb-2xl">Loved by forward thinkers</h2>
        <div className="columns-1 md:columns-3 gap-lg space-y-lg">
          <div className="break-inside-avoid glass p-lg rounded-lg shadow-xl border-l-4 border-primary">
            <p className="text-body-md mb-lg italic">"Voxly has completely transformed how we handle product feedback. The real-time nature isn't just a gimmick—it's a competitive advantage."</p>
            <div className="flex items-center gap-md">
              <img alt="Sarah Chen" className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnNUN67N3KvPaPctAUqP7GKEFf484KQ6ogSB51YysZvK9i6FhxSbexKkTuBQDePeM8b1PstbypcpRL_zresg8OCIEyoW2o8SUKBjvkTE5cR0rR7k_qmnw-kPYH1U1U2BAr8BlfB7as53YVtkgnlqEm6jN8ASXOWxD9uks2Vbg3jfK4JLZJU3l_FjMxn0NftkWLDN-UVtIys4a_taRovOzLYg_7fSHRR1ukJKWU9wvyNKibQPbNNpCipCdLP7AO-S2lGaIVGzmVx4g"/>
              <div>
                <p className="font-bold text-sm">Sarah Chen</p>
                <p className="text-xs text-on-surface-variant">Head of Design, Stripe</p>
              </div>
            </div>
          </div>
          <div className="break-inside-avoid glass p-lg rounded-lg">
            <p className="text-body-md mb-lg italic">"The Bento-style dashboards make it so easy to see high-level trends at a glance. It's the most beautiful data tool I've used."</p>
            <div className="flex items-center gap-md">
              <img alt="James Wilson" className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM9RUHUckd9sOn4EcGIu_nwKHYIpIUM-AhqNwQXYDHsAWc88vNEpKgsotojJCsRN624_0OQ6Inj2-SbLWM6nxAAsCNXTXTyq8i-VU_HSNuUL86Ph6JQF1tSIzx36FqJwGAy6SO6tZITUWwZynrMSSxOad--ygqHrfBQzlMbl9qMNiGT7NVVVIqyGC7v7DKWtREHfRb3cx7hQ9l0itkrrX5HgSBxm6yzGUg1Fp1O-sFvUWU3F8rF8jiDm8fYQ9-Yc2GHEydzAa9qC0"/>
              <div>
                <p className="font-bold text-sm">James Wilson</p>
                <p className="text-xs text-on-surface-variant">Product Manager, Linear</p>
              </div>
            </div>
          </div>
          <div className="break-inside-avoid glass p-lg rounded-lg shadow-[0px_0px_30px_rgba(108,99,255,0.2)]">
            <div className="flex gap-1 mb-md">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <p className="text-body-md mb-lg italic">"We've seen a 40% increase in response rates since switching from Typeform. The mobile experience is flawless."</p>
            <div className="flex items-center gap-md">
              <img alt="Elena Rodriguez" className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUl0Z4uk5JOjXnlN2o8gTfoCNdXSJ7IpFh3hW2v778U3bFblbomFszL7vhd6BZGKk6_QcSspu6iXL_rryivUxRd_MvE4jO6h2mmyqQBwqQBLFIYKumiUCEy5S77IQowDnEsDQ9X_Lg0M3IuT4-heVmQZX74EQCWX5WfPFVjceihiW3PRtI7t0DxA3fYHTz5OmUr8ai-BpzFYT-TY0ZkFcK0d6f47_39rnGUGCE8RS5eQaShlW16SemXort7bpben9n8a5-kcdIqxU"/>
              <div>
                <p className="font-bold text-sm">Elena Rodriguez</p>
                <p className="text-xs text-on-surface-variant">UX Director, Airbnb</p>
              </div>
            </div>
          </div>
          <div className="break-inside-avoid glass p-lg rounded-lg">
            <p className="text-body-md mb-lg italic">"Security was our #1 concern. Voxly exceeded our requirements while remaining incredibly easy to use for the end-user."</p>
            <div className="flex items-center gap-md">
              <img alt="Marcus Thorne" className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDEtajwrpw-AtTXSjvqFAKIA4GgmVtuWIuThb-0dXOnTzvQF3F-e-_tKq9AzHbTLQ3WX7TYnVoRYzSfsyEQ4Ou3XyvLpJTyw9AXimPioomzyJZCLisv0vPZmKW9A93aiCLz9jHWQu5RGOghUWLYn37non-X0dTDbGyZ3vx31OFskGlux8fUZPe9owy70ac_MmdSQ-lCrPFawyakqrxpqx4obh3iu7NXsaVj3hapOoLR4KJfAtVw4JMWQQRsfYNc8MNQWPjmAGRJc0"/>
              <div>
                <p className="font-bold text-sm">Marcus Thorne</p>
                <p className="text-xs text-on-surface-variant">CTO, Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-2xl bg-surface-container-low w-[100vw] relative left-1/2 -ml-[50vw]">
        <div className="max-w-container_max mx-auto px-lg">
          <div className="text-center mb-2xl">
            <h2 className="font-headline-xl text-headline-xl mb-md">Scale intelligence at your pace</h2>
            <div className="flex items-center justify-center gap-md">
              <span className="text-on-surface-variant">Monthly</span>
              <div className="w-12 h-6 bg-primary-container rounded-full relative cursor-pointer p-1">
                <div className="absolute right-1 w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <span className="text-on-surface font-bold">Yearly <span className="text-tertiary text-xs ml-1">(20% OFF)</span></span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {}
            <div className="glass p-2xl rounded-lg border border-outline-variant/20 hover:scale-[1.02] transition-transform">
              <h3 className="font-bold text-xl mb-sm">Free</h3>
              <p className="text-on-surface-variant text-sm mb-lg">For individuals starting out.</p>
              <div className="mb-2xl">
                <span className="text-4xl font-display-lg">$0</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-md mb-2xl">
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 5 Active Polls</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 100 Responses / month</li>
                <li className="flex items-center gap-sm text-sm"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Basic Analytics</li>
              </ul>
              <Link to={ctaLink} className="w-full py-md border border-outline-variant rounded-lg font-bold hover:bg-surface-variant transition-colors inline-block text-center">{user ? "Go to Dashboard" : "Start for Free"}</Link>
            </div>
            {}
            <div className="glass p-2xl rounded-lg border-2 border-primary relative voxly-glow hover:scale-[1.05] transition-transform z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-md py-1 rounded-full text-xs font-bold">MOST POPULAR</div>
              <h3 className="font-bold text-xl mb-sm">Pro</h3>
              <p className="text-on-surface-variant text-sm mb-lg">Power for growing businesses.</p>
              <div className="mb-2xl">
                <span className="text-4xl font-display-lg">$49</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-md mb-2xl">
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited Polls</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 10,000 Responses / month</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Advanced AI Insights</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Custom Branding</li>
              </ul>
              <Link to={ctaLink} className="w-full py-md brand-gradient text-on-primary rounded-lg font-bold shadow-lg inline-block text-center">{user ? "Go to Dashboard" : "Upgrade to Pro"}</Link>
            </div>
            {}
            <div className="glass p-2xl rounded-lg border border-outline-variant/20 hover:scale-[1.02] transition-transform">
              <h3 className="font-bold text-xl mb-sm">Team</h3>
              <p className="text-on-surface-variant text-sm mb-lg">Unlimited scale for organizations.</p>
              <div className="mb-2xl">
                <span className="text-4xl font-display-lg">$199</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-md mb-2xl">
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Everything in Pro</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Unlimited Responses</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Team Collaboration Hub</li>
                <li className="flex items-center gap-sm text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Dedicated Account Manager</li>
              </ul>
              <Link to={ctaLink} className="w-full py-md border border-outline-variant rounded-lg font-bold hover:bg-surface-variant transition-colors inline-block text-center">{user ? "Go to Dashboard" : "Contact Sales"}</Link>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-2xl max-w-container_max mx-auto px-lg mb-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-xl mb-2xl text-center">
          <div>
            <p className="text-4xl font-display-lg text-primary">2.4M+</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mt-2">Daily Votes</p>
          </div>
          <div>
            <p className="text-4xl font-display-lg text-primary">12k+</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mt-2">Active Brands</p>
          </div>
          <div>
            <p className="text-4xl font-display-lg text-primary">100ms</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mt-2">Sync Speed</p>
          </div>
          <div>
            <p className="text-4xl font-display-lg text-primary">99.9%</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mt-2">Uptime</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-2xl text-center border border-primary/30 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] -z-10 rounded-full"></div>
          <h2 className="font-display-lg text-headline-xl md:text-display-lg mb-lg">Ready to make smarter decisions?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-[600px] mx-auto mb-2xl">Join thousands of data-driven teams using Voxly to bridge the gap between questions and clarity.</p>
          <div className="flex flex-col md:flex-row justify-center gap-md">
            <Link to={ctaLink} className="brand-gradient text-on-primary px-2xl py-md rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              {user ? "Go to Dashboard" : "Get Started Now"}
            </Link>
            <Link to="/dashboard" className="glass px-2xl py-md rounded-full font-bold text-lg border border-outline-variant hover:bg-surface-variant transition-colors inline-block text-center">
              Explore Templates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
