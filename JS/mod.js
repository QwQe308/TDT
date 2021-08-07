let modInfo = {
	name        : "破坏树",
	id          : "TDT",
	author      : "Genoplex（神之海）",
	pointsName  : "损耗点数",
	discordName : "",
	discordLink : "",
	changelogLink: "",
	initialStartPoints: new Decimal (0),
	
	offlineLimit: 0,
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "",
}

let changelog = ''

let winText = `恭喜，你达到了作者目前版本所设置的目标<br>但是，一切都还没结束`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	//增减益处理
	gain = gain.times(1/player.Damage.Generate_Debuff)
	gain = gain.times(player.Damage.Generate_Buff)

	if(hasUpgrade('Damage',11))
	{
		gain = gain.times(2)
	}
	if(hasUpgrade('Damage',12))
	{
		gain = gain.times(upgradeEffect('Damage',12))
	}
	if(hasUpgrade('Damage',13))
	{
		gain = gain.times(upgradeEffect('Damage',13))
	}
	if(hasUpgrade('Damage',21))
	{
		gain = gain.times(upgradeEffect('Damage',21))
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function()
	{
		return (player.Damage.PD_Clickables[2]==0)
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}