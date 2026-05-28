const engineeringCollegeRows = `
1	Brindavan College of Engineering, Bengaluru Urban
2	VTU Extension Center, Bengaluru Urban
3	Impact School of Architecture, Bengaluru Urban
4	Sir M Visvesvaraya Institute of Technology, Bengaluru Urban
5	Amrutha Institute of Engineering & Management Sciences, Bengaluru Urban
6	Dayananda Sagar College of Engineering, Bengaluru Urban
7	East West Institute of Technology, Bengaluru Urban
8	New Horizon College of Engineering, Bengaluru Urban
9	KS School of Engineering & Management, Bengaluru Urban
10	Islamiah Institute of Technology, Bengaluru Urban
11	MVJ College of Engineering, Bengaluru Urban
12	Govt. SKSJ Technological Institute, Bengaluru Urban
13	HKBK College of Engineering, Bengaluru Urban
14	Dr. Sri Sri Sri Shivakumara Mahaswamy College, Bengaluru Urban
15	Sri Sairam College of Engineering, Bengaluru Urban
16	Gopalan College of Engineering & Management, Bengaluru Urban
17	Nitte School of Architecture, Bengaluru Urban
18	BTL Institute of Technology & Management, Bengaluru Urban
19	RR Institute of Technology, Bengaluru Urban
20	BNM Institute of Technology, Bengaluru Urban
21	Cambridge Institute of Technology, Bengaluru Urban
22	VTU Extension Centre IR Rasta, Bengaluru Urban
23	Bangalore College of Engineering & Technology, Bengaluru Urban
24	AMC Engineering College, Bengaluru Urban
25	BMS School of Architecture, Bengaluru Urban
26	MS Engineering College, Bengaluru Urban
27	Sambhram Institute of Technology, Bengaluru Urban
28	Vemana Institute of Technology, Bengaluru Urban
29	Nitte Meenakshi Institute of Technology, Bengaluru Urban
30	Dayananda Sagar College of Architecture, Bengaluru Urban
31	Jyothy Institute of Technology, Bengaluru Urban
32	T John Institute of Technology, Bengaluru Urban
33	Jnana Vikas Institute of Technology, Bengaluru Urban
34	Bangalore Technological Institute, Bengaluru Urban
35	The Oxford College of Engineering, Bengaluru Urban
36	JSS Academy of Technical Education, Bengaluru Urban
37	City Engineering College, Bengaluru Urban
38	CMR Institute of Technology, Bengaluru Urban
39	Sri Venkateshwara College of Engineering, Bengaluru Urban
40	East West School of Architecture, Bengaluru Urban
41	SJB Institute of Technology, Bengaluru Urban
42	Sri Revana Siddeshwara Institute of Technology, Bengaluru Urban
43	ACS College of Engineering, Bengaluru Urban
44	RV College of Engineering, Bengaluru Urban
45	East West College of Engineering, Bengaluru Urban
46	Aditya Academy of Architecture & Design, Bengaluru Urban
47	Gopalan School of Architecture, Bengaluru Urban
48	Don Bosco Institute of Technology, Bengaluru Urban
49	PESIT Bangalore South Campus, Bengaluru Urban
50	RNS Institute of Technology, Bengaluru Urban
51	Atria Institute of Technology, Bengaluru Urban
52	MS Ramaiah Institute of Technology, Bengaluru Urban
53	RR School of Architecture, Bengaluru Urban
54	KNS Institute of Technology, Bengaluru Urban
55	Acharya Institute of Technology, Bengaluru Urban
56	BMS Evening College of Engineering, Bengaluru Urban
57	Acharya NRV School of Architecture, Bengaluru Urban
58	RajaRajeswari College of Engineering, Bengaluru Urban
59	KS Institute of Technology, Bengaluru Urban
60	Sri Krishna Institute of Technology, Bengaluru Urban
61	Bangalore Institute of Technology, Bengaluru Urban
62	Impact College of Engineering & Applied Sciences, Bengaluru Urban
63	BMS Institute of Technology & Management, Bengaluru Urban
64	Honeywell Technologies Solutions VTU Centre, Bengaluru Urban
65	BMS College of Architecture, Bengaluru Urban
66	RV Institute of Technology & Management, Bengaluru Urban
67	Global Academy of Technology, Bengaluru Urban
68	SJB School of Architecture & Planning, Bengaluru Urban
69	Vijaya Vittala Institute of Technology, Bengaluru Urban
70	East Point College of Engineering & Technology, Bengaluru Urban
71	VTU Extension Centre United Technologies, Bengaluru Urban
72	Dayananda Sagar Academy of Technology & Management, Bengaluru Urban
73	APS College of Engineering, Bengaluru Urban
74	BMS College of Engineering, Bengaluru Urban
75	Sai Vidya Institute of Technology, Bengaluru Urban
76	Sapthagiri College of Engineering, Bengaluru Urban
77	Dr Ambedkar Institute of Technology, Bengaluru Urban
78	Nagarjuna College of Engineering & Technology, Bengaluru Urban
79	RNS School of Architecture, Bengaluru Urban
80	Cambridge Institute of Technology, Bengaluru Rural
81	Sir MV School of Architecture, Bengaluru Rural
82	Rajiv Gandhi Institute of Technology, Bengaluru Rural
83	BGS School of Architecture, Bengaluru Rural
84	Alpha College of Engineering, Bengaluru Rural
85	Vivekananda Institute of Technology, Bengaluru Rural
86	Jain College of Engineering, Belagavi
87	Gogte Institute of Technology, Belagavi
88	KLE College of Engineering & Technology, Belagavi
89	Hirasugar Institute of Technology, Belagavi
90	SG Balekundri Institute of Technology, Belagavi
91	VSM’s Institute of Technology, Belagavi
92	Angadi Institute of Technology & Management, Belagavi
93	Maratha Mandal Engineering College, Belagavi
94	Jain College of Engineering & Research, Belagavi
95	Shaikh College of Engineering & Technology, Belagavi
96	Maharaja Institute of Technology, Mysuru
97	Mysore College of Engineering & Management, Mysuru
98	ATME College of Engineering, Mysuru
99	Mysore School of Architecture, Mysuru
100	GSSS Institute of Engineering & Technology for Women, Mysuru
101	Govt. Tool Room & Training Centre, Mysuru
102	Vidya Vardhaka College of Engineering, Mysuru
103	Maharaja Institute of Technology Mysore, Mysuru
104	National Institute of Engineering, Mysuru
105	Vidya Vikas Institute of Technology, Mysuru
106	Visvesvaraya Technological University PG Centre, Mysuru
107	Wadiyar Centre for Architecture, Mysuru
108	NIE South Institute of Technology, Mysuru
109	National Institute of Engineering North, Mysuru
110	PA College of Engineering, Dakshina Kannada
111	SDM Institute of Technology, Dakshina Kannada
112	Mangalore Marine College & Technology, Dakshina Kannada
113	Alvas Institute of Engineering & Technology, Dakshina Kannada
114	Bearys Institute of Technology, Dakshina Kannada
115	Canara Engineering College, Dakshina Kannada
116	Shree Devi Institute of Technology, Dakshina Kannada
117	Sahyadri College of Engineering & Management, Dakshina Kannada
118	KVG College of Engineering, Dakshina Kannada
119	Yenepoya Institute of Technology, Dakshina Kannada
120	AJ Institute of Engineering & Technology, Dakshina Kannada
121	Srinivas School of Engineering, Dakshina Kannada
122	Mangalore Institute of Technology & Engineering, Dakshina Kannada
123	Karavali Institute of Technology, Dakshina Kannada
124	Srinivas Institute of Technology, Dakshina Kannada
125	Vivekananda College of Engineering & Technology, Dakshina Kannada
126	St Joseph Engineering College, Dakshina Kannada
127	HMS School of Architecture, Tumakuru
128	Akshaya Institute of Technology, Tumakuru
129	Sri Basaveshwara Institute of Technology, Tumakuru
130	Kalpataru Institute of Technology, Tumakuru
131	Siddaganga Institute of Technology, Tumakuru
132	HMS Institute of Technology, Tumakuru
133	Channabasaveshwara Institute of Technology, Tumakuru
134	Shridevi Institute of Engineering & Technology, Tumakuru
135	Government Engineering College, Hassan
136	Rajeev Institute of Technology, Hassan
137	NDRK Institute of Technology, Hassan
138	Govt. Engineering College, Hassan
139	Malnad College of Engineering, Hassan
140	Bahubali College of Engineering, Hassan
141	PES College of Engineering, Mandya
142	BGS Institute of Technology, Mandya
143	Government Engineering College, Mandya
144	G Madegowda Institute of Technology, Mandya
145	Cauvery Institute of Technology, Mandya
146	Mysuru Royal Institute of Technology, Mandya
147	KCT Engineering College, Kalaburagi
148	Veerappa Nisty Engineering College, Kalaburagi
149	Appa Institute of Engineering & Technology, Kalaburagi
150	PDA College of Engineering, Kalaburagi
151	KBN College of Engineering, Kalaburagi
152	Godutai Engineering College for Women, Kalaburagi
153	Shetty Institute of Technology, Kalaburagi
154	VTU PG Centre, Kalaburagi
155	SDM College of Engineering & Technology, Dharwad
156	Jain College of Engineering, Dharwad
157	AGM Rural College of Engineering & Technology, Dharwad
158	KLE Institute of Technology, Dharwad
159	Ballari Institute of Technology & Management, Ballari
160	Govt. Engineering College, Ballari
161	Proudadevaraya Institute of Technology, Ballari
162	Rao Bahaddur Y Mahabaleshwarappa Engineering College, Ballari
163	Lingaraj Appa Engineering College, Bidar
164	Guru Nanak Dev Engineering College, Bidar
165	Basava Kalyan Engineering College, Bidar
166	Bhemanna Khandre Institute of Technology, Bidar
167	PES Institute of Technology & Management, Shivamogga
168	JNN College of Engineering, Shivamogga
169	RL Jalappa Institute of Technology, Chikkaballapur
170	Shah-Shib College of Engineering, Chikkaballapur
171	SJC Institute of Technology, Chikkaballapur
172	VTU Muddenahalli Campus, Chikkaballapur
173	Bapuji Institute of Engineering & Technology, Davangere
174	GM Institute of Technology, Davangere
175	UBDT College of Engineering, Davangere
176	Jain Institute of Technology, Davangere
177	Smt. Kamala & Sri Venkappa M Agadi College, Gadag
178	Tontadarya College of Engineering, Gadag
179	Rural Engineering College, Gadag
180	Girijabai Sail Institute of Technology, Uttar Kannada
181	Vishwanathrao Deshpande Institute of Technology, Uttar Kannada
182	Anjuman Institute of Technology & Management, Uttar Kannada
183	Basav Engineering School of Technology, Vijayapura
184	Malik Sandal Institute of Arts & Architecture, Vijayapura
185	BLDEA’s College of Engineering & Technology, Vijayapura
186	SECAB Institute of Engineering & Technology, Vijayapura
187	Dr. Timmaiah Institute of Technology, Kolar
188	CBIT College, Kolar
189	Shree Vinayaka Institute of Technology, Kolar
190	Govt. Engineering College, Ramanagara
191	Sampoorna Institute of Technology & Research, Ramanagara
192	Ghousia College of Engineering, Ramanagara
193	HKE Society’s SLN College of Engineering, Raichur
194	Government Engineering College, Raichur
195	Navodaya Institute of Technology, Raichur
196	Moodalkatte Institute of Technology, Udupi
197	Shri Madhwa Vadiraja Institute of Technology, Udupi
198	NMAM Institute of Technology, Udupi
199	Government Engineering College, Koppal
200	Government Engineering College, Haveri
201	STJ Institute of Technology, Haveri
202	Govt. Engineering College, Chamarajanagar
203	Ekalavya Institute of Technology, Chamarajanagar
204	Adichunchanagiri Institute of Technology, Chikkamagaluru
205	Coorg Institute of Technology, Kodagu
206	SJM Institute of Technology, Chitradurga
`;

export const engineeringColleges = engineeringCollegeRows
  .trim()
  .split('\n')
  .map((row) => {
    const [id, name] = row.split('\t');
    return {
      id: Number(id),
      name,
      label: `${id}. ${name}`
    };
  });
