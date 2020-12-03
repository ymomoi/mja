$(function(){

    var update_sum = function(){
        var total = 100000;
        $('.score').each(function(){
            var v = Number($(this).text());
            total -= v;
        });
        total -= Number($('#kyotaku > .val').text());
        $('#sum > .val').text(String(total));
    };

    var update_score_diff = function(){
        var a = [ 'spei', 'ssha', 'snan', 'ston' ];
        var s = {};
        $('.score').each(function(){
            s[$(this).attr('name')] = Number($(this).text());
        });
        $('.score_diff[name="ston"]').text(
            String(s['spei']-s['ston']) + ' / ' +
            String(s['ssha']-s['ston']) + ' / ' +
            String(s['snan']-s['ston'])
        );
        $('.score_diff[name="snan"]').text(
            String(s['ston']-s['snan']) + ' / ' +
            String(s['spei']-s['snan']) + ' / ' +
            String(s['ssha']-s['snan'])
        );
        $('.score_diff[name="ssha"]').text(
            String(s['snan']-s['ssha']) + ' / ' +
            String(s['ston']-s['ssha']) + ' / ' +
            String(s['spei']-s['ssha'])
        );
        $('.score_diff[name="spei"]').text(
            String(s['ssha']-s['spei']) + ' / ' +
            String(s['snan']-s['spei']) + ' / ' +
            String(s['ston']-s['spei'])
        );
    };

    $('#kaze').click(function(){
        $('#kaze > span').toggleClass('inactive');
    });

    $('#kyoku').click(function(){
        var p = [ '東 親番', '南', '西', '北' ];
        var n = [ 'ston', 'snan', 'ssha', 'spei' ];
        $('#sel-kyoku').dialog({
            modal: true,
            title: '局選択',
            buttons: {
                '一局': function(){
                    $('#kyoku').text('一局');
                    $('#p1 > .kaze').text(p[0]);
                    $('#p2 > .kaze').text(p[1]);
                    $('#p3 > .kaze').text(p[2]);
                    $('#p4 > .kaze').text(p[3]);
                    $('#p1 > .score').attr('name', n[0]);
                    $('#p2 > .score').attr('name', n[1]);
                    $('#p3 > .score').attr('name', n[2]);
                    $('#p4 > .score').attr('name', n[3]);
                    $(this).dialog('close');
                },
                '二局': function(){
                    $('#kyoku').text('二局');
                    $('#p1 > .kaze').text(p[3]);
                    $('#p2 > .kaze').text(p[0]);
                    $('#p3 > .kaze').text(p[1]);
                    $('#p4 > .kaze').text(p[2]);
                    $('#p1 > .score').attr('name', n[3]);
                    $('#p2 > .score').attr('name', n[0]);
                    $('#p3 > .score').attr('name', n[1]);
                    $('#p4 > .score').attr('name', n[2]);
                    $(this).dialog('close');
                },
                '三局': function(){
                    $('#kyoku').text('三局');
                    $('#p1 > .kaze').text(p[2]);
                    $('#p2 > .kaze').text(p[3]);
                    $('#p3 > .kaze').text(p[0]);
                    $('#p4 > .kaze').text(p[1]);
                    $('#p1 > .score').attr('name', n[2]);
                    $('#p2 > .score').attr('name', n[3]);
                    $('#p3 > .score').attr('name', n[0]);
                    $('#p4 > .score').attr('name', n[1]);
                    $(this).dialog('close');
                },
                '四局': function(){
                    $('#kyoku').text('四局');
                    $('#p1 > .kaze').text(p[1]);
                    $('#p2 > .kaze').text(p[2]);
                    $('#p3 > .kaze').text(p[3]);
                    $('#p4 > .kaze').text(p[0]);
                    $('#p1 > .score').attr('name', n[1]);
                    $('#p2 > .score').attr('name', n[2]);
                    $('#p3 > .score').attr('name', n[3]);
                    $('#p4 > .score').attr('name', n[0]);
                    $(this).dialog('close');
                },
            },
        });
        update_sum();
        update_score_diff();
    });

    $('.score').click(function(){
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

        var set_score = function(){
            $('.cvalue').each(function(){
                var v = Number($(this).val());
                var n = $(this).attr('name');
                var o;
                if (n == 'kyotaku') {
                    o = Number($("#kyotaku > span").text());
                    $("#kyotaku > span").text(String(o+v));
                }
                else {
                    o = Number($(`.score[name="${n}"]`).text());
                    $(`.score[name="${n}"]`).text(String(o+v));
                }
            });
        };

        var reset_cvalue = function(){
            $('.cvalue').each(function(){
                $(this).val('');
            });
        };

        $('#calc').dialog({
            modal: true,
            title: '点棒受け渡し',
            buttons: {
                'キャンセル': function(){ $(this).dialog('close'); },
                '更新': function(){
                    var diff = calc_diff();
                    if (diff != 0) {
                        alert('受け渡しの合計を0にしてください');
                        return;
                    }
                    set_score();
                    update_score_diff();
                    reset_cvalue();
                    $(this).dialog('close');
                },
            }
        });
    });

    $('#hon').click(function(){
        var n = Number($('#hon > span').text());
        $('#hon > span').text(String(n+1));
    });
    $('#hon').dblclick(function(){
        $('#hon > span').text('0');
    });

    $('.kaze').click(function(){
        $(this).parent().children('.reach').toggleClass('inactive');
    });
});
