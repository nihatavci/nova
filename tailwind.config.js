/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: "#E5E7EB",
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: {
  				DEFAULT: "#F5F5F5",
  				secondary: "#F9F9FA",
  			},
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: "#3B82F6",
  				foreground: 'hsl(var(--primary-foreground))',
  				hover: "#2563eb",
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			text: {
  				DEFAULT: "#374151",
  				secondary: "rgb(55 65 81 / 0.8)",
  				muted: "rgb(55 65 81 / 0.6)",
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: '8px',
  			md: '6px',
  			sm: '4px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		boxShadow: {
  			'sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
  			'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: '65ch',
  					color: '#374151',
  					h1: {
  						fontWeight: '700',
  						lineHeight: '1.2',
  					},
  					h2: {
  						fontWeight: '600',
  						lineHeight: '1.3',
  					},
  				},
  			},
  		},
  		spacing: {
  			xs: '0.25rem',
  			sm: '0.5rem',
  			md: '1rem',
  			lg: '1.5rem',
  			xl: '2rem',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 