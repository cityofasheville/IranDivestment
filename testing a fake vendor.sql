insert into internal.vendors(a_vendor_id, a_vendor_name, a_vend_alpha_sort, v_dba)
values(999999,'Oil and Natural Gas Fake Test','','');

delete from internal.vendors where a_vendor_id = 999999;
select * from internal.vendors where a_vendor_id = 999999;