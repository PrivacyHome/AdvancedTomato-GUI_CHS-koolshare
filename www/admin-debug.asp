<!--
Tomato GUI
Copyright (C) 2006-2010 Jonathan Zarate
http://www.polarcloud.com/tomato/

For use with Tomato Firmware only.
No part of this file may be used without permission.
--><title>调试</title>
<content>
	<style>table.fields-table tr td:first-child { width: 40%; }</style>
	<script type="text/javascript">

		//	<% nvram("at_update,tomatoanon_answer,debug_nocommit,debug_cprintf,debug_cprintf_file,console_loglevel,t_cafree,t_hidelr,debug_ddns,debug_norestart"); %>

		function nvramCommit()
		{
			fields.disableAll('_fom', 1);
			form.submitHidden('nvcommit.cgi', { '_nextpage': myName() });
		}

		function verifyFields(focused, quiet)
		{
			return 1;
		}

		function save()
		{
			var fom = E('_fom');
			fom.debug_nocommit.value = fom.f_debug_nocommit.checked ? 1 : 0;
			fom.debug_cprintf.value = fom.f_debug_cprintf.checked ? 1 : 0;
			fom.debug_cprintf_file.value = fom.f_debug_cprintf_file.checked ? 1 : 0;
			fom.t_cafree.value = fom.f_cafree.checked ? 1 : 0;
			fom.t_hidelr.value = fom.f_hidelr.checked ? 1 : 0;
			fom.debug_ddns.value = fom.f_debug_ddns.checked ? 1 : 0;

			var a = [];
			if (fom.f_nr_crond.checked) a.push('crond');
			if (fom.f_nr_dnsmasq.checked) a.push('dnsmasq');
			/* LINUX26-BEGIN */
			if (fom.f_nr_hotplug2.checked) a.push('hotplug2');
			/* LINUX26-END */
			if (fom.f_nr_igmprt.checked) a.push('igmprt');
			fom.debug_norestart.value = a.join(',');

			form.submit(fom, 1);
		}
	</script>

	<form id="_fom" method="post" action="tomato.cgi">
		<input type="hidden" name="_nextpage" value="/#admin-misc.asp">

		<input type="hidden" name="debug_nocommit">
		<input type="hidden" name="debug_cprintf">
		<input type="hidden" name="debug_cprintf_file">
		<input type="hidden" name="debug_ddns">
		<input type="hidden" name="debug_norestart">
		<input type="hidden" name="t_cafree">
		<input type="hidden" name="t_hidelr">

		<div class="alert alert-warning icon">
			<h5>警告！</h5> NVRAM转储文本文件可能包含无线信息
加密密钥和路由器，ISP和DDNS的用户名/密码。 不要随意共享！
		</div>

		<div class="box">
			<div class="heading">调试设置 & 信息</div>
			<div class="content">

				<div id="debug"></div>
				<script type="text/javascript">
					a = [];
					for (i = 1; i <= 8; ++i) a.push([i, i]);
					$('#debug').forms([
						{ title: '避免执行NVRAM提交', name: 'f_debug_nocommit', type: 'checkbox', value: nvram.debug_nocommit != '0' },
{ title: '启用cprintf输出到控制台', name: 'f_debug_cprintf', type: 'checkbox', value: nvram.debug_cprintf != '0' },
{ title: '启用cprintf输出到/tmp/cprintf', name: 'f_debug_cprintf_file', type: 'checkbox', value: nvram.debug_cprintf_file != '0' },
{ title: '启用DDNS输出到/tmp/mdu-*', name: 'f_debug_ddns', type: 'checkbox', value: nvram.debug_ddns != '0' },
{ title: '将缓存内存和缓冲区计算为可用内存', name: 'f_cafree', type: 'checkbox', value: nvram.t_cafree == '1' },
{ title: '不显示LAN到路由器连接', name: 'f_hidelr', type: 'checkbox', value: nvram.t_hidelr == '1' },
{ title: '终端日志级别', name: 'console_loglevel', type: 'select', options: a, value: fixInt(nvram.console_loglevel, 1, 8, 1) },
						{ title: '如果以下进程死亡，请勿重新启动', multi: [
							{ name: 'f_nr_crond', type: 'checkbox', suffix: ' crond<br>', value: (nvram.debug_norestart.indexOf('crond') != -1) },
							{ name: 'f_nr_dnsmasq', type: 'checkbox', suffix: ' dnsmasq<br>', value: (nvram.debug_norestart.indexOf('dnsmasq') != -1) },
							/* LINUX26-BEGIN */
							{ name: 'f_nr_hotplug2', type: 'checkbox', suffix: ' hotplug2<br>', value: (nvram.debug_norestart.indexOf('hotplug2') != -1) },
							/* LINUX26-END */
							{ name: 'f_nr_igmprt', type: 'checkbox', suffix: ' igmprt<br>', value: (nvram.debug_norestart.indexOf('igmprt') != -1) }
						] }
					]);
				</script>
				<hr>

				&raquo; <a href="#clear-cookies.asp">清除Cookie</a><br>
				&raquo; <a href="javascript:nvramCommit()">NVRAM提交</a><br>
				<br>

				&raquo; <a href="/cfe/cfe.bin?_http_id=<% nv(http_id); %>">下载CFE</a><br>
				&raquo; <a href="/ipt/iptables.txt?_http_id=<% nv(http_id); %>">下载Iptables Dump</a><br>
				<!-- IPV6-BEGIN -->
				&raquo; <a href="/ip6t/ip6tables.txt?_http_id=<% nv(http_id); %>">下载Ip6tables Dump</a><br>
				<!-- IPV6-END -->
				&raquo; <a href="/logs/syslog.txt?_http_id=<% nv(http_id); %>">下载日志</a><br>
				&raquo; <a href="/nvram/nvram.txt?_http_id=<% nv(http_id); %>">下载NVRAM Dump</a>
			</div>
		</div>

		<button type="button" value="Save" id="save-button" onclick="save()" class="btn btn-primary">保存 <i class="icon-check"></i></button>
		<button type="button" value="Cancel" id="cancel-button" onclick="javascript:reloadPage();" class="btn">取消 <i class="icon-cancel"></i></button>
		<span id="footer-msg" class="alert alert-warning" style="visibility: hidden;"></span>
	</form>
</content>