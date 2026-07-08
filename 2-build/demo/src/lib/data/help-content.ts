export type HelpTone = 'good' | 'warn' | 'critical' | 'neutral';

export type HelpStateViz =
	| {
			kind: 'compare';
			heading?: string;
			items: { label: string; caption: string; tone: HelpTone; preview?: string }[];
	  }
	| {
			kind: 'timeline';
			heading?: string;
			items: { label: string; tone: HelpTone }[];
	  }
	| {
			kind: 'split';
			heading?: string;
			segments: { label: string; pct: number; tone: HelpTone }[];
	  }
	| {
			kind: 'gauge-compare';
			heading?: string;
			items: { label: string; value: number; threshold: number }[];
	  }
	| {
			kind: 'heatmap';
			heading?: string;
			caption?: string;
	  }
	| {
			kind: 'progress-compare';
			heading?: string;
			items: { label: string; current: number; total: number; note?: string }[];
	  }
	| {
			kind: 'status-cards';
			heading?: string;
			items: { title: string; body: string; tone: HelpTone }[];
	  }
	| {
			kind: 'pills';
			heading?: string;
			items: { label: string; tone: HelpTone }[];
	  }
	| {
			kind: 'workflow';
			heading?: string;
			steps: { label: string; tone?: HelpTone }[];
	  }
	| {
			kind: 'log-samples';
			heading?: string;
			rows: { time: string; type: string; message: string; tone: HelpTone }[];
	  }
	| {
			kind: 'bars';
			heading?: string;
			items: { label: string; pct: number; tone: HelpTone; caption: string }[];
	  };

export type HelpContent = {
	title: string;
	what: string;
	why: string;
	howToRead: string;
	usedFor: string;
	states?: HelpStateViz;
};

export type HelpId =
	| 'labor-saved'
	| 'compliance-risk'
	| 'dim-waste'
	| 'impact-band'
	| 'chargeback-exposure'
	| 'otif-at-risk'
	| 'a-item-accuracy'
	| 'override-rate'
	| 'portfolio-trend'
	| 'action-queue'
	| 'dynamic-batch'
	| 'cartonization-efficiency'
	| 'aisle-congestion-heatmap'
	| 'exception-log'
	| 'exception-aging'
	| 'friction-watch'
	| 'sync-queue'
	| 'hygiene-gate'
	| 'phase-1-5-signals'
	| 'ai-engine-log'
	| 'compliance-workflow'
	| 'source-pdf'
	| 'extracted-rules'
	| 'ship-station'
	| 'next-pick'
	| 'pick-route'
	| 'batch-progress'
	| 'report-exception'
	| 'pack-workflow'
	| 'pack-scan'
	| 'pack-directive'
	| 'pack-weigh'
	| 'pack-ship'
	| 'override-panel';

export const HELP_CONTENT: Record<HelpId, HelpContent> = {
	'labor-saved': {
		title: 'Labor saved',
		what: 'An estimate of how much warehouse labor cost you avoided this week by sending pickers along smarter routes instead of wandering aisle by aisle.',
		why: 'Walking is the hidden tax in fulfillment. Less walking means the same team ships more orders without overtime — directly protecting margin.',
		howToRead:
			'The big dollar figure is weekly savings. The picks-per-hour line compares throughput to a typical 60–80/hr baseline. A rising sparkline means routing is getting better over time.',
		usedFor:
			'Executives use this to confirm the pick-path AI is paying for itself. Supervisors drill into the pick workflow to see how batches are grouped on the floor.',
		states: {
			kind: 'bars',
			heading: 'Picks per hour trend',
			items: [
				{ label: 'Improving week', pct: 78, tone: 'good', caption: 'Routing learning · travel down' },
				{ label: 'Flat week', pct: 42, tone: 'warn', caption: 'Little gain · check batching' }
			]
		}
	},
	'compliance-risk': {
		title: 'Compliance risk',
		what: 'A traffic-light summary of shipments that might violate a retailer’s shipping rules — plus the dollar value of potential penalties (chargebacks).',
		why: 'Big-box retailers fine suppliers when labels, carton sizes, or packing rules are wrong. One bad week can erase weeks of picking savings.',
		howToRead:
			'Red (R) = blocked or failing now. Yellow (Y) = at risk, needs review. Green (G) = passing. Dollar exposure is the estimated penalty if issues ship as-is.',
		usedFor:
			'Leadership tracks whether compliance automation is catching problems before boxes leave the dock. Drill-down opens the compliance review workflow.',
		states: {
			kind: 'compare',
			heading: 'Traffic-light states',
			items: [
				{ preview: '2R', label: 'Red', caption: 'Blocked or failing now', tone: 'critical' },
				{ preview: '5Y', label: 'Yellow', caption: 'At risk · needs review', tone: 'warn' },
				{ preview: '41G', label: 'Green', caption: 'Passing validation', tone: 'good' }
			]
		}
	},
	'dim-waste': {
		title: 'DIM waste',
		what: 'Money lost each week because orders were packed in boxes larger than necessary, triggering higher shipping charges based on “dimensional” (size-based) weight.',
		why: 'Carriers bill on whichever is higher: actual weight or a formula based on box size. Oversized cartons quietly inflate freight bills.',
		howToRead:
			'Weekly dollar loss is the headline. Volume utilization % shows how full boxes are on average — higher is better. A downward cost curve means cartonization is improving.',
		usedFor:
			'Executives watch freight leakage. Packers get a single recommended box size at the pack station to cut waste before labels print.',
		states: {
			kind: 'bars',
			heading: 'Box fill rate',
			items: [
				{ label: 'Tight pack', pct: 92, tone: 'good', caption: 'Low DIM waste' },
				{ label: 'Oversized pack', pct: 58, tone: 'critical', caption: 'Paying for empty space' }
			]
		}
	},
	'impact-band': {
		title: 'Combined impact',
		what: 'A rollup of the three margin areas above — labor, compliance, and box sizing — expressed as estimated annual profit protected.',
		why: 'Individual widgets tell part of the story; this line answers “so what?” in one number a CFO can remember.',
		howToRead:
			'Annual margin protected annualizes this week’s savings and avoided losses. A hygiene note appears if master data quality is blocking an AI feature.',
		usedFor:
			'Slide-ready proof that Phase 1 AI features are working together, not as disconnected experiments.'
	},
	'chargeback-exposure': {
		title: 'Chargeback exposure',
		what: 'The dollar value of retailer fines you could owe if current compliance issues ship without being fixed.',
		why: 'Chargebacks hit after the fact — you only feel them on next month’s invoice. Surfacing exposure early lets you fix orders before they leave.',
		howToRead:
			'Total exposure in dollars. The bar chart shows the trend over recent days — bars shrinking toward green is good.',
		usedFor:
			'Quick pulse on compliance financial risk without opening the full compliance board.',
		states: {
			kind: 'bars',
			heading: 'Exposure trend',
			items: [
				{ label: 'Improving', pct: 35, tone: 'good', caption: '$2.1K · issues resolving' },
				{ label: 'Building', pct: 82, tone: 'critical', caption: '$8.4K · act before ship' }
			]
		}
	},
	'otif-at-risk': {
		title: 'OTIF at-risk',
		what: 'A count of shipments that might miss On-Time In-Full (OTIF) delivery promises — the standard big retailers use to score suppliers.',
		why: 'Missing OTIF triggers fines and can jeopardize vendor status. Compliance holds and late picks both show up here.',
		howToRead:
			'The number is shipments at risk today. Colored dots along the week show which days had warnings (amber) or critical issues (red).',
		usedFor:
			'Connects warehouse operations to customer-facing delivery commitments executives are measured on.',
		states: {
			kind: 'timeline',
			heading: 'Week at a glance',
			items: [
				{ label: 'On track', tone: 'good' },
				{ label: 'On track', tone: 'good' },
				{ label: 'Warning', tone: 'warn' },
				{ label: 'On track', tone: 'good' },
				{ label: 'Warning', tone: 'warn' },
				{ label: 'At risk', tone: 'critical' },
				{ label: 'At risk', tone: 'critical' }
			]
		}
	},
	'a-item-accuracy': {
		title: 'A-item accuracy',
		what: 'How often inventory counts match reality for your highest-volume SKUs (“A-items”) — the products that matter most to throughput.',
		why: 'Bad counts cause pickers to walk to empty bins, batches to break, and promises to slip. Accuracy on fast movers has outsized impact.',
		howToRead:
			'Percentage against a 90% target. The gauge fills green above threshold, amber below. Treat sustained drops as a data-quality alert.',
		usedFor:
			'Supervisors catch inventory drift before it becomes floor chaos; executives see whether the catalog is trustworthy enough for AI routing.',
		states: {
			kind: 'gauge-compare',
			heading: 'Against the 90% gate',
			items: [
				{ label: 'Healthy', value: 93, threshold: 90 },
				{ label: 'Below gate', value: 86, threshold: 90 }
			]
		}
	},
	'override-rate': {
		title: 'Override rate',
		what: 'How often warehouse staff manually override what the system recommended — forcing a scan, changing a batch, or picking a different box.',
		why: 'Some overrides are legitimate exceptions; a spike often means the algorithm is wrong, data is stale, or training is needed.',
		howToRead:
			'Percent of actions overridden vs. total. The split shows approved vs. flagged overrides. Sparkline compares today to a 7-day baseline — climbing lines warrant investigation.',
		usedFor:
			'Friction signal for supervisors; trust metric for product teams tuning AI recommendations.',
		states: {
			kind: 'split',
			heading: 'Override quality split',
			segments: [
				{ label: 'Approved', pct: 80, tone: 'good' },
				{ label: 'Flagged', pct: 20, tone: 'warn' }
			]
		}
	},
	'portfolio-trend': {
		title: '8-week portfolio trend',
		what: 'A chart of how labor savings, compliance avoidance, and box-sizing recovery have trended across the last eight weeks.',
		why: 'Weekly snapshots can look good or bad by chance; a multi-week view shows whether improvements are sticking.',
		howToRead:
			'Grouped bars per week — three series for labor, compliance, and DIM. Taller bars mean more value captured that week. Look for consistent growth, not one-off spikes.',
		usedFor:
			'Appendix / board-level storytelling — proof the program compounds over time, not just a single demo week.'
	},
	'action-queue': {
		title: 'Action queue',
		what: 'A single banner that adds up everything on the warehouse floor that needs a supervisor’s decision right now.',
		why: 'Supervisors don’t open a dashboard to browse — they need to know “what’s on fire?” in under three seconds.',
		howToRead:
			'“All clear” means zero blocking items. Otherwise you’ll see counts like ship blocks, compliance holds, sync dead zones, and open exceptions. Red accent means act now.',
		usedFor:
			'Shift-start triage and continuous monitoring. “Triage all” would open a filtered work list (demo: visual only).',
		states: {
			kind: 'status-cards',
			heading: 'Banner states',
			items: [
				{
					title: 'All clear',
					body: 'Zero items need attention · floor nominal',
					tone: 'good'
				},
				{
					title: 'Needs attention',
					body: '3 ship blocks · 2 compliance holds · 5 exceptions',
					tone: 'critical'
				}
			]
		}
	},
	'dynamic-batch': {
		title: 'Dynamic batch',
		what: 'Live status of pick batches — groups of orders routed together so one picker collects multiple items in one efficient walk.',
		why: 'Random one-order-at-a-time picking wastes half the shift walking. Dynamic batching clusters nearby items and similar SKUs.',
		howToRead:
			'Active batches and clusters show how much work is in flight. Kilometers saved compares optimized paths to naive aisle-by-aisle walks this shift.',
		usedFor:
			'Supervisors monitor throughput and can override a batch if congestion or a VIP order requires replanning.'
	},
	'cartonization-efficiency': {
		title: 'Cartonization efficiency',
		what: 'How well pack stations are filling boxes — average volume utilization across recent packs.',
		why: 'Half-empty boxes still ship at dimensional weight rates. Utilization is the operational mirror of executive DIM waste.',
		howToRead:
			'Higher % means tighter packing. Sudden drops may mean unusual order mixes, missing product dimensions, or packers overriding recommendations.',
		usedFor:
			'Floor-level check before freight costs show up on the executive dashboard.',
		states: {
			kind: 'bars',
			heading: 'Volume utilization',
			items: [
				{ label: 'Efficient shift', pct: 92, tone: 'good', caption: 'Boxes well filled' },
				{ label: 'Slipping shift', pct: 71, tone: 'warn', caption: 'Check overrides & dims' }
			]
		}
	},
	'aisle-congestion-heatmap': {
		title: 'Aisle congestion heatmap',
		what: 'A floor map showing where pickers are clustered right now — which aisles or zones are crowded.',
		why: 'Too many pickers in one aisle creates traffic jams, missed scans, and safety issues. Hot zones slow the whole shift.',
		howToRead:
			'Warmer colors = more picker density. The callout names the bottleneck zone and how many pickers are there.',
		usedFor:
			'Supervisors rebalance labor, pause batch releases into a hot zone, or investigate a stuck batch.',
		states: {
			kind: 'heatmap',
			heading: 'Picker density',
			caption: 'Cool zones are clear · warm zones are congested'
		}
	},
	'exception-log': {
		title: 'Exception log',
		what: 'A real-time feed of problems on the floor — empty bins, unreadable barcodes, blocked shipments, forced confirmations, and auto-reroutes.',
		why: 'Exceptions are where margin leaks: every reroute is extra steps; every ship block is a delayed truck.',
		howToRead:
			'Each row shows time, problem type, location or order ID, and what the system did (rerouted, blocked, flagged). Unresolved items aging over 30 minutes surface as a chip above the feed.',
		usedFor:
			'Supervisor’s primary audit trail — spot patterns (same bin, same SKU) and verify the system handled issues correctly.',
		states: {
			kind: 'log-samples',
			heading: 'Example feed rows',
			rows: [
				{
					time: '09:14',
					type: 'Bin empty',
					message: 'A-12 · auto-rerouted',
					tone: 'warn'
				},
				{
					time: '09:11',
					type: 'Ship block',
					message: 'PO-8842 · PO missing on label (W09)',
					tone: 'critical'
				}
			]
		}
	},
	'exception-aging': {
		title: 'Exception aging',
		what: 'A small histogram showing how long open exceptions have been waiting without resolution.',
		why: 'A five-minute empty-bin report is normal; the same issue at 45 minutes means someone is stuck or the fix failed.',
		howToRead:
			'Bars bucket exceptions by age (e.g., 0–15m, 15–30m, 30m+). Weight shifting right means the backlog is getting stale.',
		usedFor:
			'Prioritize which exceptions to tackle first during a busy shift.',
		states: {
			kind: 'bars',
			heading: 'Age buckets',
			items: [
				{ label: '0–15 min', pct: 70, tone: 'good', caption: 'Fresh · normal turnover' },
				{ label: '30+ min', pct: 45, tone: 'critical', caption: 'Stale · escalate now' }
			]
		}
	},
	'friction-watch': {
		title: 'Friction watch',
		what: 'A sticky sidebar of “is the system healthy?” signals — sync backlog, overrides, data hygiene, and inventory accuracy.',
		why: 'AI recommendations are only as good as handheld connectivity and catalog data. Friction metrics catch infrastructure problems before they become pick failures.',
		howToRead:
			'Scan the mini-cards: green values are nominal, amber/red thresholds are documented per metric. This section stays visible while supervisors work the main canvas.',
		usedFor:
			'Continuous health check during a shift — complements the action queue’s urgent items with slower-burn risks.'
	},
	'sync-queue': {
		title: 'Sync queue',
		what: 'How many scan events from handheld devices are waiting to upload to the central system.',
		why: 'Offline or lagging devices mean inventory counts and pick confirmations are stale — the AI routes against yesterday’s truth.',
		howToRead:
			'Queue depth with oldest unsynced event age in minutes. Hourly bars show buildup pattern. Yellow above 10, red above 25 (demo thresholds).',
		usedFor:
			'Triggers IT or supervisor intervention to restore connectivity before bad data spreads.',
		states: {
			kind: 'compare',
			heading: 'Queue depth',
			items: [
				{ preview: '7', label: 'Nominal', caption: 'Sync catching up', tone: 'good' },
				{ preview: '18', label: 'Warning', caption: 'Above 10 · watch', tone: 'warn' },
				{ preview: '32', label: 'Critical', caption: 'Above 25 · act now', tone: 'critical' }
			]
		}
	},
	'hygiene-gate': {
		title: 'Hygiene gate',
		what: 'The percentage of product SKUs that have complete master data — dimensions, weights, and bin locations — required for AI features.',
		why: 'Without size data you can’t recommend boxes; without bin coordinates you can’t optimize walks. This gate blocks or mutes features until data is fixed.',
		howToRead:
			'Percent complete vs. a 90% target. Below threshold, expect gated cartonization or muted executive cards.',
		usedFor:
			'Data stewards and supervisors know when to prioritize catalog cleanup over tuning algorithms.',
		states: {
			kind: 'gauge-compare',
			heading: 'Catalog completeness',
			items: [
				{ label: 'AI features on', value: 94, threshold: 90 },
				{ label: 'Features gated', value: 82, threshold: 90 }
			]
		}
	},
	'phase-1-5-signals': {
		title: 'Phase 1.5 signals',
		what: 'Early-warning metrics planned for a future release — inbound processing lag (dock-to-stock) and phantom inventory risk.',
		why: 'Shown muted so stakeholders see the roadmap without adding Phase 1 clutter. Not actionable in this demo.',
		howToRead:
			'Dock-to-stock hours = time from truck arrival to items available to pick. Phantom risk = likelihood system thinks stock exists where it doesn’t.',
		usedFor:
			'Sets expectations for what’s next without distracting from Phase 1 triage workflows.'
	},
	'ai-engine-log': {
		title: 'AI engine log',
		what: 'A concise, timestamped stream of what the AI backend did — parsed a retailer guide, indexed pick paths, updated a constraint.',
		why: 'Operators trust systems they can audit. This is not a chatbot — it’s a flight recorder for automated decisions.',
		howToRead:
			'Each line: time, event type (guide, pathing, etc.), and plain-language message. Scan for errors or unexpected changes after uploads.',
		usedFor:
			'Builds confidence during demos and helps support teams trace why a rule or route changed.'
	},
	'compliance-workflow': {
		title: 'Compliance workflow',
		what: 'The end-to-end path from a partner’s PDF shipping manual to enforceable rules at the ship station.',
		why: 'Wholesale partners publish dense routing requirements. Manual interpretation doesn’t scale and mistakes are expensive.',
		howToRead:
			'Upload source document → human approves extracted rules → activate per DC → floor enforcement blocks bad labels at print.',
		usedFor:
			'Shows AI-assisted rule extraction with a human in the loop — not fully autonomous compliance.',
		states: {
			kind: 'workflow',
			heading: 'End-to-end flow',
			steps: [
				{ label: 'Upload PDF' },
				{ label: 'Review rules', tone: 'warn' },
				{ label: 'Enforce at ship', tone: 'good' }
			]
		}
	},
	'source-pdf': {
		title: 'Source document',
		what: 'The original partner routing guide PDF — the legal source of truth for how shipments must be packed and labeled.',
		why: 'Every automated rule should trace back to a page and quote auditors can verify.',
		howToRead:
			'Snippet highlights the passage the AI used. Page number links the rule to the document. “Extracting…” state shows processing in flight.',
		usedFor:
			'Reviewers confirm the AI read the right section before approving a constraint.',
		states: {
			kind: 'status-cards',
			heading: 'Processing states',
			items: [
				{ title: 'Extracting', body: '47 rules found · 3 ambiguous', tone: 'warn' },
				{ title: 'Ready to review', body: 'Snippet linked to page 6', tone: 'good' }
			]
		}
	},
	'extracted-rules': {
		title: 'Extracted rules',
		what: 'Machine-readable shipping constraints pulled from the PDF — each tied to a partner and awaiting human approve, edit, or reject.',
		why: 'Ambiguous language (“on carton or on label”) needs a person to confirm before it blocks live orders.',
		howToRead:
			'Cards show partner, constraint text, penalty codes, and status pills. Selected card syncs with the PDF snippet. Approved rules require per-DC activation.',
		usedFor:
			'Compliance managers curate the rule library that ship stations enforce automatically.',
		states: {
			kind: 'pills',
			heading: 'Review statuses',
			items: [
				{ label: 'Approved', tone: 'good' },
				{ label: 'Ambiguous', tone: 'warn' },
				{ label: 'Rejected', tone: 'critical' }
			]
		}
	},
	'ship-station': {
		title: 'Ship station enforcement',
		what: 'The pack/ship screen where rules meet reality — packer taps Print shipping label and the validator runs in under 200ms.',
		why: 'Catching violations at print time is the last affordable checkpoint before chargebacks and rejected pallets.',
		howToRead:
			'Pass: validator green, label printed. Block: red modal names the violation and one fix action. Gated: no rules activated for this DC — enforcement disabled.',
		usedFor:
			'Floor operators see immediate feedback; supervisors see blocks aggregate in the action queue.',
		states: {
			kind: 'status-cards',
			heading: 'Enforcement outcomes',
			items: [
				{ title: 'Validator passed', body: 'Label printed · order cleared', tone: 'good' },
				{ title: 'Ship blocked', body: 'PO missing on label (W09) · reprint with PO #', tone: 'critical' }
			]
		}
	},
	'next-pick': {
		title: 'Next pick',
		what: 'The picker’s current instruction — which bin to visit, which product to collect, quantity, and which tote slot to place it in.',
		why: 'Mobile pick-path replaces paper lists with one authoritative next step, reducing wrong picks and backtracking.',
		howToRead:
			'Large location code is the aisle/bin. SKU and description confirm the product. Qty and tote slot tell where to put it after scanning.',
		usedFor:
			'Primary UI for warehouse associates during batch picking.'
	},
	'pick-route': {
		title: 'Your route',
		what: 'A live floor map showing where you are, where the next bin is, and the path the system wants you to walk — including congestion zones to avoid.',
		why: 'Pickers shouldn’t memorize the floor. A visual route cuts wrong turns and makes reroutes obvious when a bin is empty.',
		howToRead:
			'Green dot is you. Pulsing pin is the next pick. Dashed line is the optimized path. Red-tinted zones are bottlenecks — reroutes may steer around them.',
		usedFor:
			'Wayfinding during batch picking and after exception reroutes.'
	},
	'batch-progress': {
		title: 'Batch progress',
		what: 'A ring showing how many picks are done in the current batch, plus estimated walking distance saved vs. an unoptimized path.',
		why: 'Progress feedback keeps pickers motivated and helps supervisors estimate when a batch will clear.',
		howToRead:
			'“3 of 12” fills the ring. “~Xm saved” is cumulative walk reduction from smart sequencing this batch.',
		usedFor:
			'Operational pacing — not a financial metric on the associate screen.',
		states: {
			kind: 'progress-compare',
			heading: 'Batch completion',
			items: [
				{ label: 'Just started', current: 2, total: 12, note: '~120m saved' },
				{ label: 'Mid-batch', current: 7, total: 12, note: '~340m saved' }
			]
		}
	},
	'report-exception': {
		title: 'Report exception',
		what: 'A quick menu for floor problems — empty bin, damaged goods, wrong item — that triggers rerouting or supervisor alerts.',
		why: 'Hiding problems slows everyone down. One-tap reporting lets the system replan while the picker moves on.',
		howToRead:
		'Tap Report issue to open the sheet. Choosing “Bin empty” triggers a reroute animation and advances the batch. “Damaged” and “Wrong item” show what the next production step would be.',
		usedFor:
			'Associates escalate issues without radio calls; exceptions appear in the supervisor log.',
		states: {
			kind: 'pills',
			heading: 'Common reports',
			items: [
				{ label: 'Bin empty', tone: 'warn' },
				{ label: 'Damaged', tone: 'critical' },
				{ label: 'Wrong item', tone: 'warn' }
			]
		}
	},
	'pack-workflow': {
		title: 'Pack station',
		what: 'The cartonization workflow — scan tote, pack to one recommended box, weigh, then print label with compliance validation.',
		why: 'Letting every packer guess box size recreates DIM waste. Scan-to-ship enforces one authoritative answer and catches compliance violations before labels release.',
		howToRead:
			'Step rail shows Scan → Pack → Weigh → Ship. Header carries retailer and order context. Override panel appears only when a packer deviates from the recommendation.',
		usedFor:
			'Pack associates run the full station arc; confirmed ships feed utilization and DIM metrics upstream.',
		states: {
			kind: 'workflow',
			heading: 'Station steps',
			steps: [
				{ label: 'Scan tote' },
				{ label: 'Pack to directive' },
				{ label: 'Weigh · DIM vs actual' },
				{ label: 'Print label · validate' }
			]
		}
	},
	'pack-scan': {
		title: 'Scan tote',
		what: 'The first step — scan the picked tote or order barcode to load cartonization for that shipment.',
		why: 'Scan-verify matches pick-path discipline and prevents packing the wrong order into the wrong box.',
		howToRead:
			'Scan the barcode on the tote from picking. Missing product dimensions block the flow and route back to receiving.',
		usedFor: 'Associates start every pack session here; no directive loads until scan succeeds.'
	},
	'pack-directive': {
		title: 'Pack directive',
		what: 'The recommended carton type, dimensions, estimated billable weight, and item list for the order being packed.',
		why: 'Billable weight preview shows freight impact before tape is applied — packing becomes a cost decision, not just a physical one.',
		howToRead:
			'Green carton code is the choice to use. Diagram illustrates fit with placement and dunnage hints. “Pack blocked” means missing product dimensions — fix data at receiving first.',
		usedFor:
			'Associates pack to spec; confirmed packs feed utilization metrics upstream.',
		states: {
			kind: 'status-cards',
			heading: 'Directive states',
			items: [
				{ title: 'Use carton MED-2', body: '18×12×10 · est. billable 14.2 lb', tone: 'good' },
				{ title: 'Pack blocked', body: 'Missing SKU dimensions · capture at receiving', tone: 'warn' }
			]
		}
	},
	'override-panel': {
		title: 'Override',
		what: 'A required reason code when a packer chooses a different box than the system recommended.',
		why: 'Overrides are allowed but audited — unexplained deviations hide training gaps, bad data, or fraud.',
		howToRead:
			'Tap “Use different box” to open the panel. Select a reason before substituting cartons. Overrides surface on the supervisor friction watch.',
		usedFor:
			'Balances associate autonomy with accountability and feeds override-rate analytics.'
	},
	'pack-weigh': {
		title: 'Capture weight',
		what: 'Scale reading compared to billable weight — carriers charge whichever is higher: actual weight or dimensional (DIM) weight.',
		why: 'Packing is a cost decision. Showing both numbers before label print prevents surprise freight charges and validates the carton choice.',
		howToRead:
			'Actual comes from the connected scale. Billable shows DIM or actual, whichever the carrier will use. Green highlight means DIM governs — tighter boxes save money.',
		usedFor:
			'Associates confirm weight before releasing the shipping label.',
		states: {
			kind: 'compare',
			heading: 'Weight comparison',
			items: [
				{ label: 'Actual', caption: '2.1 lb from scale', tone: 'neutral' },
				{ label: 'Billable', caption: '2.4 lb · DIM wins', tone: 'good' }
			]
		}
	},
	'pack-ship': {
		title: 'Print label',
		what: 'Final step — print shipping label after a deterministic compliance validator checks retailer routing rules (<200ms).',
		why: 'Compliance and cartonization meet at ship. Hard blocks here prevent chargebacks — same enforcement pattern as slide 11, on the pack station floor.',
		howToRead:
			'Pass shows green confirmation. Fail shows one fix action — no chat. Wholesale orders run stricter rule sets than DTC.',
		usedFor:
			'Associates complete the pack-station arc; passed ships feed executive DIM and compliance metrics.',
		states: {
			kind: 'status-cards',
			heading: 'Label outcomes',
			items: [
				{ title: 'Validator passed', body: 'Label printed · ship cleared', tone: 'good' },
				{ title: 'Ship blocked', body: 'One fix action · reprint template', tone: 'critical' }
			]
		}
	}
};
