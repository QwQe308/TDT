addLayer('Damage',
{
    name          : 'Damage',
    symbol        : 'Da',
    resource      : '破坏指数',
    baseResource  : '损耗点',
    baseAmount    :  function()
    {
        return player.points
    },
    color         : '#FFFFFF',
    type          : 'normal',
    exponent      :  0.5,
    row           :  1,
    position      :  0,
    requires      :  new Decimal(10),

    resetDescription : '提高 ',

    hotkeys :
    [

    ],

    tooltip :  function()
    {
        return formatWhole(player.Damage.points) + ' 破坏指数'
    },

    tabFormat :
    {
        '扩张':
        {
            unlocked :  function()
            {
                return true
            },
            content:
            [
                'main-display',
                'prestige-button',
                'blank',
                ['display-text',function(){return player.Damage.Text}],
                'blank',
                'upgrades',
            ]
        },
        '行动':
        {
            unlocked :  function()
            {
                return hasUpgrade('Damage',31)
            },
            content:
            [
                'main-display',
                'prestige-button',
                'blank',
                ['display-text',function(){return player.Damage.Text}],
                'blank',
                'clickables',
            ]
        },
        '破坏':
        {
            unlocked :  function()
            {
                return hasUpgrade('Damage',33)
            },
            content:
            [
                'main-display',
                'prestige-button',
                'blank',
                ['display-text',function(){return player.Damage.Text}],
                'blank',
                'challenges'
            ]
        },
        '削弱概览':
        {
            unlocked :  function()
            {
                return true
            },
            content:
            [
                ['row',[['column',[['display-text',function(){return '维护部门<br>│<br>├<br>│<br>├<br>│<br>└'}]],{'width':'75px'}],['column',[['display-text',function(){return '<br><br>' + player.Damage.MD_Text[1] + '<br><br>' + player.Damage.MD_Text[4] + '<br><br>' + player.Damage.MD_Text[7]}]],{'width':'200px'}],['column',[['display-text',function(){return '<br><br>' + player.Damage.MD_Text[2] + '<br><br>' + player.Damage.MD_Text[5] + '<br><br>' + player.Damage.MD_Text[8]}]],{'width':'150px'}],['column',[['display-text',function(){return '<br><br>' + player.Damage.MD_Text[3] + '<br><br>' + player.Damage.MD_Text[6] + '<br><br>' + player.Damage.MD_Text[9]}]],{'width':'150px'}]]],
                'blank',
                ['row',[['column',[['display-text',function(){return '执法部门<br>│<br>├<br>│<br>├<br>│<br>├<br>│<br>├<br>│<br>└'}]],{'width':'75px'}],['column',[['display-text',function(){return '<br><br>' + player.Damage.PD_Text[1] + '<br><br>' + player.Damage.PD_Text[4] + '<br><br>' + player.Damage.PD_Text[7] + '<br><br>' + player.Damage.PD_Text[10] + '<br><br>' + player.Damage.PD_Text[13]}]],{'width':'200px'}],['column',[['display-text',function(){return '<br><br>' + player.Damage.PD_Text[2] + '<br><br>' + player.Damage.PD_Text[5] + '<br><br>' + player.Damage.PD_Text[8] + '<br><br>' + player.Damage.PD_Text[11] + '<br><br>' + player.Damage.PD_Text[14]}]],{'width':'150px'}],['column',[['display-text',function(){return '<br><br>' + player.Damage.PD_Text[3] + '<br><br>' + player.Damage.PD_Text[6] + '<br><br>' + player.Damage.PD_Text[9] + '<br><br>' + player.Damage.PD_Text[12] + '<br><br>' + player.Damage.PD_Text[15]}]],{'width':'150px'}]],function(){if(player.Damage.MD_Clickables[2]==0){return{'opacity':'0'}}}],
            ]
        }
    },

    layerShown :  function()
    {
        return true
    },

    startData :  function()
    {    
        return{
        unlocked        :  true,
		points          :  new Decimal(0),

        //文本显示：
        Text            : '',
        Text_Stage      :  0,
        MD_Text         : [0,'','','','？','？','？','？','？','？'],
        PD_Text         : [0,'','','','？','？','？','？','？','？','？','？','？','？','？','？'],

        //维护部门购买项
        MD_Clickables   : [0,0,0,0],
        PD_Clickables   : [0,0,0,0],   

        //减益：
        Generate_Debuff :  1,
        GainMult_Debuff :  1,
        Points_Reduce   :  0,
        Catch_Percent   :  0,

        //增益
        Generate_Buff   :  1,
        Points_Gain     :  0,
        }
    },
        
    gainMult :  function()
    {
        mult = new Decimal(1)
        if(player.Damage.points >= (10*(1+player.Damage.MD_Clickables[2]*0.01)))
        {
            mult = mult.mul(1/player.Damage.GainMult_Debuff)
        }
        return mult
    },

    gainExp :  function()
    {
        return new Decimal(1)
    },

    update :  function(diff)
    {
        //点数计算前重要函数执行
        //帮手被逮捕几率计算
        player.Damage.Catch_Percent = (player.Damage.MD_Clickables[1]*(Math.log(player.Damage.points+10)))/2-5
        Catch_Percent_Tick = 1-(Math.pow((1-player.Damage.Catch_Percent),diff))



        //点数处理
        //点数获取减益处理
        player.Damage.Generate_Debuff = (Math.pow(player.Damage.points,0.5))*(Math.pow(0.98952,player.Damage.MD_Clickables[2]))
        if(player.Damage.Generate_Debuff < 1)
        {
            player.Damage.Generate_Debuff = 1
        }
        //点数获取增益处理
        player.Damage.Generate_Buff = 1+0.05*player.Damage.MD_Clickables[1]
        if(player.Damage.Generate_Buff < 1)
        {
            player.Damage.Generate_Buff = 1
        }



        //破坏指数处理
        //破坏指数减益处理
        player.Damage.GainMult_Debuff = (Math.pow(Math.max(player.Damage.points,10)-10,0.25))*(Math.pow(0.98952,player.Damage.MD_Clickables[2]))
        if(player.Damage.GainMult_Debuff < 1)
        {
            player.Damage.GainMult_Debuff = 1
        }

        

        //破坏指数自动化处理
        //破坏指数自动削减处理
        player.Damage.Points_Reduce = (Math.max(100*(1+player.Damage.MD_Clickables[2]*0.01),player.Damage.points)-100*(1+player.Damage.MD_Clickables[2]*0.01))*0.05*(Math.pow(0.98952,player.Damage.MD_Clickables[2]))
        player.Damage.points = player.Damage.points.add(-(player.Damage.Points_Reduce))
        //破坏指数自动获取处理
        player.Damage.points = player.Damage.points.add((player.Damage.MD_Clickables[1]*0.0025*getResetGain(this.layer))*diff)



        //文本处理
        //主文本显示处理
        player.Damage.Text = ('维护部门正在工作！')
        if(player.Damage.MD_Clickables[1] >= 1)
        {
            player.Damage.Text = '帮手每秒帮助获得 ' + format(player.Damage.MD_Clickables[1]*0.0025*getResetGain(this.layer)) + ' 破坏指数<br><br>' + player.Damage.Text
        }
        if(player.Damage.MD_Clickables[2] >= 1)
        {
            player.Damage.Text += '执法部门开始行动！'
        }
        //概况文本显示处理
        if((player.Damage.points >= 0)&&(player.Damage.Text_Stage == 0)) player.Damage.Text_Stage = 1
        if((player.Damage.points >= 10)&&(player.Damage.Text_Stage == 1)) player.Damage.Text_Stage = 2
        if((player.Damage.points >= 100)&&(player.Damage.Text_Stage == 2)) player.Damage.Text_Stage = 3
        player.Damage.MD_Text[1] = '减少损耗点数获取'
        player.Damage.MD_Text[2] = '该减益始终存在'
        player.Damage.MD_Text[3] = 'x' + format(1/player.Damage.Generate_Debuff)
        if(player.Damage.Text_Stage >= 2)
        {
            player.Damage.MD_Text[4] = '减少破坏指数获取'
            player.Damage.MD_Text[5] = 'DP >= ' + format(10*(1+player.Damage.MD_Clickables[2]*0.01))
            player.Damage.MD_Text[6] = 'x' + format(1/player.Damage.GainMult_Debuff)
        }
        if(player.Damage.Text_Stage >= 3)
        {
            player.Damage.MD_Text[7] = '减少破坏指数'
            player.Damage.MD_Text[8] = 'DP >= ' + format(100*(1+player.Damage.MD_Clickables[2]*0.01))
            player.Damage.MD_Text[9] = format(player.Damage.Points_Reduce) + '/s'
        }
        player.Damage.PD_Text[1] = '概率降低 [DaB1] 数量'
        player.Damage.PD_Text[2] = '该减益始终存在'
        player.Damage.PD_Text[3] = format(player.Damage.MD_Clickables[1]*(Math.log(player.Damage.points+10))/2-5) + '%/s'
    },

    doReset :  function(Resetting_Layer)
    {

    },

    upgrades:
    {
        11:
        {
            title       : '严重磨损',
            description : '<br>损耗点获取量是原来的 2 倍',
            cost        :  new Decimal(5),
            style       :  function()
            {
                return{
                    'height' : '150px',
                    'width'  : '150px'
                }
            }
        },
        12:
        {
            title       : '碎块',
            description :  function()
            {
                return '<br>根据破坏指数提高损耗点获取量<br><br>效果：x' + format(this.effect())
            },
            unlocked    :  function()
            {
                return hasUpgrade('Damage',11)
            },
            cost        :  new Decimal(10),
            effect      :  function()
            {
                value = player.Damage.points.add(1).log10().add(1)
                return value
            },
            style       :  function()
            {
                return{
                    'height' : '150px',
                    'width'  : '150px'
                }
            }
        },
        13:
        {
            title       : '扬尘',
            description :  function()
            {
                return '<br>根据损耗点提高损耗点的获取量<br><br>效果：x' + format(this.effect())
            },
            unlocked    :  function()
            {
                return hasUpgrade('Damage',11)
            },
            cost        :  new Decimal(10),
            effect      :  function()
            {
                value = player.points.add(1).log10(10).pow(0.5).add(1)
                return value
            },
            style       :  function()
            {
                return{
                    'height' : '150px',
                    'width'  : '150px'
                }
            }
        },
        21:
        {
            title       : '工具',
            description :  function()
            {
                return '<br>帮手提高损耗点和破坏指数的获取量<br><br>效果：x' + format(this.effect())
            },
            unlocked    :  function()
            {
                return (player.Damage.MD_Clickables[2] >= 1)
            },
            cost        :  new Decimal(100),
            effect      :  function()
            {
                value = player.Damage.MD_Clickables[1]/20+1
                return value
            },
            style       :  function()
            {
                return{
                    'height':'150px',
                    'width' :'150px'
                }
            }
        },
        31:
        {
            fullDisplay :  function()
            {
                return '<h3>寻找帮手</h3><br><br>解锁购买项<br><br>需求：25 破坏指数'
            },
            unlocked    :  function()
            {
                return (hasUpgrade('Damage',12)&&hasUpgrade('Damage',13))
            },
            canAfford   :  function()
            {
                return (player.Damage.points >= 25)
            },
            style       :  function()
            {
                return{
                    'height' : '150px',
                    'width'  : '150px'
                }
            }
        },
        32:
        {
            fullDisplay :  function()
            {
                return '<h3>阻挠维护部门</h3><br><br>解锁购买项<br><br>需求：10 帮手'
            },
            unlocked    :  function()
            {
                return hasUpgrade('Damage',31)
            },
            canAfford   :  function()
            {
                return (player.Damage.MD_Clickables[1]>=10)
            },
            style       :  function()
            {
                return{
                    'height' : '150px',
                    'width'  : '150px'
                }
            }
        },
        33:
        {
            title       : '开始行动！',
            description :  function()
            {
                return '<br>解锁挑战'
            },
            unlocked    :  function()
            {
                return (player.Damage.MD_Clickables[2] >= 1)
            },
            cost        :  new Decimal(100),
            style       :  function()
            {
                return{
                    'height':'150px',
                    'width' :'150px'
                }
            }
        }
    },

    clickables:
    {
        11:
        {
            title       : 'DaB1 寻找帮手',
            display     :  function()
            {
                Level       = '人数：' + formatWhole(player.Damage.MD_Clickables[1])
                Description = '寻找合适的人进行破坏行动<br>提高损耗点数获取量 x0.05<br>自动获取 0.0025% 可获取破坏指数'
                Effect      = '效果：x' + format(player.Damage.MD_Clickables[1]*0.05+1) + ' ' + format(player.Damage.MD_Clickables[1]*0.0025) + '%'
                Price       = '花费：' + format(Math.pow(player.Damage.MD_Clickables[1],2)*0.9+10) + ' 破坏指数'
                return Level + '<br><br>' + Description + '<br><br>' + Effect + '<br><br>' + Price
            },
            unlocked    :  function()
            {
                return hasUpgrade('Damage',31)
            },
            canClick    :  function()
            {
                return (player.Damage.points >= (Math.pow(player.Damage.MD_Clickables[1],2)*0.9+10))
            },
            onClick     :  function()
            {
                player.Damage.points = player.Damage.points.add(-(Math.pow(player.Damage.MD_Clickables[1],2)*0.9+10))
                player.Damage.MD_Clickables[1] += 1
            },
            style       :  function()
            {
                return{
                    'height':'235px',
                    'width' :'235px'
                }
            }
        },
        12:
        {
            title       : 'DaB2 阻挠维护部门',
            display     :  function()
            {
                Level       = '等级：' + formatWhole(player.Damage.MD_Clickables[2])
                Description = '突袭烦人的维护部门，给他们教训<br>减弱维护部门减益 1%<br>提高维护部门减益门槛 1%'
                Effect      = '效果：*' + format(Math.pow(0.98952,player.Damage.MD_Clickables[2]))
                Price       = '花费：' + format(Math.pow(player.Damage.MD_Clickables[2]+5,2)) + ' 破坏指数'
                return Level + '<br><br>' + Description + '<br><br>' + Effect + '<br><br>' + Price
            },
            unlocked    :  function()
            {
                return hasUpgrade('Damage',32)
            },
            canClick    :  function()
            {
                return (player.Damage.points >= (Math.pow(player.Damage.MD_Clickables[2]+5,2)))&&(player.Damage.MD_Clickables[2]<75)
            },
            onClick     :  function()
            {
                player.Damage.points = player.Damage.points.add(-(Math.pow(player.Damage.MD_Clickables[2]+5,2)))
                player.Damage.MD_Clickables[2] += 1
            },
            style       :  function()
            {
                return{
                    'height':'235px',
                    'width' :'235px'
                }
            }
        }
    },

    challenges:
    {
        11:
        {
            name : '对抗维护部门！',
            fullDisplay :  function()
            {
                ChallengeDescription = '破坏维护部门来停止他们！'
                Mention              = '注意事项：进入时清空所有破坏指数和升级<br>中途退出时清空所有帮手'
                GoalDescription      = '目标：在维护部门增强 250% 的情况下<br>达到 100 破坏指数'
                EffectDescription    = '奖励：维护部门的能力削减至 75%'
                return ChallengeDescription  + '<br><br>' + Mention + '<br><br>' + GoalDescription + '<br><br>' + EffectDescription
            },
            unlocked    :  function()
            {
                return hasUpgrade('Damage',33)
            },
            canComplete :  function()
            {
                return (player.Damage.points >= 100)
            },
            completionLimit : 3,
            onEnter     :  function()
            {
                player.points = 0
                player.Damage.points = 0
                player.Damage.upgrades = []
            },
            style       :  function()
            {
                return{
                    'width':'350px'
                }
            }
        }
    }
})