$(function(){
    var player = [ 'p1', 'p2', 'p3', 'p4' ];
    var kaze = [ 'ton', 'nan', 'sha', 'pei' ];

    // グローバルデータ
    var $g = $('body');
    $g.data({
        'bakaze': 0,
        'kyoku': 1,
        'hon': 0,
        'kyotaku': 0,
        'sum': 0,
    });
    $.each(player, function(i, v){
        $g.data(v, { 'name': `${v}`, 'score': 25000, 'reach': false });
    });

    // 親/子の点数を返す
    var round100 = function(n){
        return Math.ceil(n/100) * 100;
    };
    var calc_score = function(han, fu, oya, tsumo){
        if (oya) {
            if (han >= 13) { return tsumo ? [ 16000 ] : [ 48000 ]; }
            if (han >= 11) { return tsumo ? [ 12000 ] : [ 36000 ]; }
            if (han >= 8) { return tsumo ? [ 8000 ] : [ 24000 ]; }
            if (han >= 6) { return tsumo ? [ 6000 ] : [ 18000 ]; }
            if (han >= 5) { return tsumo ? [ 4000 ] : [ 12000 ]; }
            if (tsumo) {
                return [ Math.min(round100(Number(fu) * 8 * 2**Number(han)), 4000) ];
            } else {
                return [ Math.min(round100(Number(fu) * 12*2 * 2**Number(han)), 12000) ];
            }
        } else {
            if (han >= 13) { return tsumo ? [ 8000, 16000 ] : [ 32000 ]; }
            if (han >= 11) { return tsumo ? [ 6000, 12000 ] : [ 24000 ]; }
            if (han >= 8) { return tsumo ? [ 4000, 8000 ] : [ 16000 ]; }
            if (han >= 6) { return tsumo ? [ 3000, 6000 ] : [ 12000 ]; }
            if (han >= 5) { return tsumo ? [ 2000, 4000 ] : [ 8000 ]; }
            if (tsumo) {
                return [ Math.min(round100(Number(fu) * 4 * 2**Number(han)), 2000),
                         Math.min(round100(Number(fu) * 8 * 2**Number(han)), 4000) ];
            } else {
                return [ Math.min(round100(Number(fu) * 8*2 * 2**Number(han)), 8000) ];
            }
        }
    };

    // 現在の局でそれぞれの風のプレイヤーを返す
    var kaze_player = function(k){
        var index = [ 0, 1, 2, 3 ];
        index = index.rot_r($g.data('kyoku')-1);
        switch (k) {
            case 'ton':
                return player[index[0]];
            case 'nan':
                return player[index[1]];
            case 'sha':
                return player[index[2]];
            default:
                return player[index[3]];
        }
    };

    // 指定されたプレイヤーの点棒を操作する
    var player_score = function(id, v){
        var d = $g.data(id);
        d.score += v;
        $g.data(id, d);
    };

    // 指定されたプレイヤー名を設定する
    var player_name = function(id, v){
        var d = $g.data(id);
        d.name = v;
        $g.data(id, d);
    };

    // 右ローテート
    Array.prototype.rot_r = function(n){
        return this.slice(n, this.length).concat(this.slice(0, n));
    };

    // 全描画
    var redraw_all = function(){
        var bakaze = [ '東', '南', '西', '北' ];
        $('#bakaze').text(bakaze[$g.data('bakaze')]);
        $('#kyoku > .val').text($g.data('kyoku'));
        $('#hon > .val').text($g.data('hon'));
        $('#kyotaku > .val').text($g.data('kyotaku'));
        $('#sum > .val').text($g.data('sum'));

        var jikaze = [ '東(親)', '南', '西', '北' ];
        jikaze = jikaze.rot_r(1-$g.data('kyoku'));
        var s = [];
        $.each(player, function(i, v){ s.push($g.data(v).score); });
        var diff = [
            String(s[3]-s[0]) + '/' + String(s[2]-s[0]) + '/' + String(s[1]-s[0]),
            String(s[0]-s[1]) + '/' + String(s[3]-s[1]) + '/' + String(s[2]-s[1]),
            String(s[1]-s[2]) + '/' + String(s[0]-s[2]) + '/' + String(s[3]-s[2]),
            String(s[2]-s[3]) + '/' + String(s[1]-s[3]) + '/' + String(s[0]-s[3]),
        ];
        $.each(player, function(i, v){
            $(`#${v} > .player`).text($g.data(v).name);
            $(`#${v} > .kaze`).text(jikaze.shift());
            $(`#${v} > .score`).text(s.shift());
            $(`#${v} > .score_diff`).text(diff.shift());
            $(`#${v} > .reach`).text($g.data(v).reach ? 'リーチ' : '');
        });
    };

    redraw_all();

    // リーチ状態をクリア
    var clear_reach = function(){
        $.each(player, function(i, v){
            var d = $g.data(v);
            d.reach = false;
            $g.data(v, d);
        });
    };

    // 場風切り替え
    $('#bakaze').click(function(){
        $g.data('bakaze', ($g.data('bakaze') + 1) % 4);
        clear_reach();
        redraw_all();
    });

    // 局切り替え
    $('#kyoku').click(function(){
        var k = $g.data('kyoku') + 1;
        if (k > 4) { k = 1; }
        $g.data('kyoku', k);
        clear_reach();
        redraw_all();
    });

    // 本場追加
    $('#hon').click(function(){
        $g.data('hon', $g.data('hon') + 1);
        clear_reach();
        redraw_all();
    });
    $('#hon').dblclick(function(){
        $g.data('hon', 0);
        clear_reach();
        redraw_all();
    });

    // リーチ状態トグル
    $('.kaze,.reach').click(function(){
        var id = $(this).parent().attr('id');
        var d = $g.data(id);
        d.reach = d.reach ? false : true;
        $g.data(id, d);
        redraw_all();
    });

    // プレイヤー情報入力ダイアログ
    $('.player').click(function(){
        $.each(player, function(i, v){
            $(`:input[name="${v}"]`).val($g.data(v).name);
        });

        $('#playerinfo').dialog({
            modal: true,
            title: 'プレイヤー情報入力',
            buttons: {
                'キャンセル': function(){ $(this).dialog('close'); },
                '更新': function(){
                    $.each(player, function(i, v){
                        var n = $(`:input[name="${v}"]`).val();
                        player_name(v, n);
                    });
                    redraw_all();
                    $(this).dialog('close');
                },
            },
        });
    });

    // 点数精算(自動入力)ダイアログ
    $('.score').click(function(){
        $.each(kaze, function(i, v){
            var id = kaze_player(v);
            $(`.n-${v}`).text($g.data(id).name);
        });
        $(':checkbox[name|="w"]').prop('checked', false);
        $(':checkbox[name|="p"]').prop('checked', false);

        var hon = $g.data('hon');
        var kyotaku = $g.data('kyotaku');
        $('#mjcalc > .ba').text(
            hon + '本場 (' + hon*300 + '点 + 供託' + kyotaku + '点)'
        );

        var clear_scores = function(){
            $(':input[name|="s"]').val('');
            $('#score').text('');
        };

        var update_scores = function(){
            clear_scores();
            if (check_inputs() != true) { return; }
            var han = $('#han').val();
            var fu = $('#fu').val();
            var oya = $(':checkbox[name="w-ton"]:checked').length > 0 ? true : false;
            var tsumo = $(':checkbox[name|="p"]:checked').length == 3 ? true : false;
            var score = calc_score(han, fu, oya, tsumo);

            var winner = $(':checkbox[name|="w"]:checked').val();
            var loser = $(':checkbox[name|="p"]:checked').val();
            if (tsumo) {
                if (oya) {
                    $('#score').text('子 ' + score[0] + '点ALL');
                    score[0] += 100*hon;
                    $(`:input[name="s-ton"]`).val(score[0]*3 + kyotaku);
                    $(`:input[name="s-nan"]`).val(-score[0]);
                    $(`:input[name="s-sha"]`).val(-score[0]);
                    $(`:input[name="s-pei"]`).val(-score[0]);
                }
                else {
                    $('#score').text('親 ' + score[1] + '点、子 ' + score[0] + '点');
                    score[0] += 100*hon;
                    score[1] += 100*hon;
                    $(`:input[name="s-ton"]`).val(-score[1]);
                    $(`:input[name="s-nan"]`).val(-score[0]);
                    $(`:input[name="s-sha"]`).val(-score[0]);
                    $(`:input[name="s-pei"]`).val(-score[0]);
                    $(`:input[name="s-${winner}"]`).val(score[1] + score[0]*2 + kyotaku);
                }

            }
            else {
                $('#score').text(score[0] + '点');
                score[0] += 300*hon;
                $(`:input[name="s-${winner}"]`).val(score[0]+kyotaku);
                $(`:input[name="s-${loser}"]`).val(-score[0]);
            }
        };

        $('#han,#fu').change(function(){ update_scores(); });
        $(':checkbox[name|="w"]').change(function(){ update_scores(); });
        $(':checkbox[name|="p"]').change(function(){ update_scores(); });

        // 1家以上のあがり、あがりと支払が同時にチェックされないよう制御
        $(':checkbox[name$="ton"]').click(function(){
            $(':checkbox[name$="ton"]').prop('checked', false);
            $(this).prop('checked', true);
        });
        $(':checkbox[name$="nan"]').click(function(){
            $(':checkbox[name$="nan"]').prop('checked', false);
            $(this).prop('checked', true);
        });
        $(':checkbox[name$="sha"]').click(function(){
            $(':checkbox[name$="sha"]').prop('checked', false);
            $(this).prop('checked', true);
        });
        $(':checkbox[name$="pei"]').click(function(){
            $(':checkbox[name$="pei"]').prop('checked', false);
            $(this).prop('checked', true);
        });

        $(':checkbox[name|="w"]').click(function(){
            $(':checkbox[name|="w"]').prop('checked', false);
            $(this).prop('checked', true);
        });

        // あがりと支払家数のチェック
        var check_inputs = function(){
            if ($(':checkbox[name|="w"]:checked').length != 1) {
                return false;
            }
            if ($(':checkbox[name|="p"]:checked').length != 1 &&
                $(':checkbox[name|="p"]:checked').length != 3) {
                return false;
            }
            return true;
        };

        $('#mjcalc').dialog({
            modal: true,
            position: { my: 'left+5% top+5%', at: 'left+5% top+5%' },
            width: '500px',
            title: '点棒受け渡し',
            buttons: {
                'キャンセル': function(){ $(this).dialog('close'); },
                '表示更新': function(){},
                '支払実行': function(){
                    if (check_inputs() != true) {
                        alert('入力値が不正です。確認してください。');
                        return;
                    }
                    update_scores();
                    $.each(kaze, function(i, v){
                        var id = kaze_player(v);
                        var s = Number($(`:input[name="s-${v}"]`).val());
                        player_score(id, s);
                    });
                    $g.data('kyotaku', 0);
                    clear_scores();
                    redraw_all();
                    $(this).dialog('close');
                },
            },
        });
    });

    // 点数精算(マニュアル入力)ダイアログ
    $(':button[name="score_manual"]').click(function(){
        $.each(kaze, function(i, v){
            var id = kaze_player(v);
            $(`.n-${v}`).text($g.data(id).name);
        });

        var calc_diff = function(){
            var diff = 0;
            $('.cvalue').each(function(){
                diff += Number($(this).val());
            });
            $('#diff').text(String(diff));
            return diff;
        };
        $('.cvalue').focus(function(){
            calc_diff();
        });

        var reset_cvalue = function(){
            $('.cvalue').each(function(){
                $(this).val('');
            });
        };

        var set_score = function(){
            $('.cvalue').each(function(){
                var v = Number($(this).val());
                var n = $(this).attr('name');
                var o;
                if (n == 'kyotaku') {
                    $g.data('kyotaku', $g.data('kyotaku') + v);
                }
                else {
                    var id = kaze_player(n);
                    player_score(id, v);
                }
            });
        };

        $('#calc').dialog({
            modal: true,
            position: { my: 'left+5% top+5%', at: 'left+5% top+5%' },
            width: '500px',
            title: '点棒受け渡し(マニュアル)',
            buttons: {
                'キャンセル': function(){ $(this).dialog('close'); },
                '更新': function(){
                    var diff = calc_diff();
                    if (diff != 0) {
                        alert('受け渡しの合計を0にしてください');
                        return;
                    }
                    set_score();
                    reset_cvalue();
                    redraw_all();
                    $(this).dialog('close');
                },
            },
        });
    });

    // 流局精算ダイアログ
    $(':button[name="ryukyoku"]').click(function(){
        $.each(kaze, function(i, v){
            var id = kaze_player(v);
            $(`.n-${v}r`).text($g.data(id).name);
        });

        $(':checkbox').each(function(){
            $(this).prop('checked', false);
        });

        $.each(kaze, function(i, k){
            var id = kaze_player(k);
            // リーチしていたプレイヤーを自動チェック
            if ($g.data(id).reach) {
                $(`:checkbox[name="r-${k}r"]`).prop('checked', true);
                $(`:checkbox[name="c-${k}r"]`).prop('checked', true);
            }
            // リーチをチェックしたら、聴牌も同時にチェックする
            $(`:checkbox[name="r-${k}r"]`).change(function(){
                if ($(this).prop('checked')) {
                    $(`:checkbox[name$="c-${k}r"]`).prop('checked', true);
                }
            });
        });

        $('#ryukyoku').dialog({
            modal: true,
            position: { my: 'left+5% top+5%', at: 'left+5% top+5%' },
            width: '500px',
            title: '流局精算',
            buttons: {
                'キャンセル': function(){ $(this).dialog('close'); },
                '精算': function(){
                    var tenpai = [];
                    var noten = [];
                    var reach = [];
                    $.each(kaze, function(i, k){
                        var id = kaze_player(k);
                        if ($(`:checkbox[name="c-${k}r"]`).prop('checked')) {
                            tenpai.push(id);
                        } else {
                            noten.push(id);
                        }
                        if ($(`:checkbox[name="r-${k}r"]`).prop('checked')) {
                            reach.push(id);
                        }
                    });

                    switch (tenpai.length) {
                        case 1:
                            player_score(tenpai[0], 3000);
                            $.each(noten, function(i, id){
                                player_score(id, -1000);
                            });
                            break;
                        case 2:
                            player_score(tenpai[0], 1500);
                            player_score(tenpai[1], 1500);
                            player_score(noten[0], -1500);
                            player_score(noten[1], -1500);
                            break;
                        case 3:
                            player_score(noten[0], -3000);
                            $.each(tenpai, function(i, id){
                                player_score(id, 1000);
                            });
                            break;
                        default:
                            break;
                    }
                    $.each(reach, function(i, id){
                        player_score(id, -1000);
                        $g.data('kyotaku', $g.data('kyotaku') + 1000);
                    });
                    redraw_all();
                    $(this).dialog('close');
                },
            },
        });
    });

    // サイコロダイアログ
    $(':button[name="dice"]').click(function(){
        var rand6 = function(){
            return Math.floor(Math.random() * 6) + 1;
        };

        var dice = function(){
            var val = [ rand6(), rand6() ];
            $('#diceroll > .field').html(
                '<img src="images/' + val[0] + '.png" />&nbsp;' +
                '<img src="images/' + val[1] + '.png" />'
            );
        };

        var count = 0;
        var roll = function(){
            if (++count > 20) {
                count = 0;
                return;
            }
            dice();
            setTimeout(roll, 50);
        };

        $('#diceroll').dialog({
            modal: true,
            position: { my: 'left+10% top+10%', at: 'left+10% top+10%' },
            width: '200px',
            title: 'サイコロ',
            buttons: {
                '振る': function(){ roll(); },
                '閉じる': function(){ $(this).dialog('close'); },
            },
        });
    });

    // 日時
    $.clock($('#clock'));
});
