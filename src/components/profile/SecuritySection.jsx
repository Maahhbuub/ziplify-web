import { useState } from 'react';
import { Key, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { SectionCard, Divider } from './SectionCard';
import api from '../../api/api';
import toast from 'react-hot-toast';
import styles from './SecuritySection.module.css';

const PASSWORD_FIELDS = [
    { key: 'current', label: 'Current password', placeholder: 'Enter current password' },
    { key: 'next', label: 'New password', placeholder: 'Min. 6 characters' },
    { key: 'confirm', label: 'Confirm new password', placeholder: 'Repeat new password' },
];

function SecuritySection() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });
    const [show, setShow] = useState({ current: false, next: false, confirm: false });
    const [saving, setSaving] = useState(false);

    const toggle = (field) => setShow(p => ({ ...p, [field]: !p[field] }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.next !== form.confirm)
            return toast.error("New passwords don't match");
        if (form.next.length < 6)
            return toast.error('Password must be at least 6 characters');

        setSaving(true);
        try {
            await api.post('/user/change-password', {
                currentPassword: form.current,
                newPassword: form.next,
            });
            toast.success('Password changed!');
            setForm({ current: '', next: '', confirm: '' });
            setOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SectionCard icon={Key} title="Security">
            <Divider />

            <div className={styles.toggleRow} onClick={() => setOpen(p => !p)}>
                <div>
                    <p className={styles.fieldLabel}>Password</p>
                    <p className={styles.fieldValue}>••••••••</p>
                </div>
                <button className={styles.changeBtn} type="button">
                    {open ? 'Cancel' : 'Change'}
                    <ChevronRight
                        size={13}
                        className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                    />
                </button>
            </div>

            {open && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    {PASSWORD_FIELDS.map(({ key, label, placeholder }) => (
                        <div key={key} className={styles.formGroup}>
                            <label className={styles.label}>{label}</label>
                            <div className={styles.pwWrap}>
                                <input
                                    type={show[key] ? 'text' : 'password'}
                                    className={styles.input}
                                    placeholder={placeholder}
                                    value={form[key]}
                                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => toggle(key)}
                                    tabIndex={-1}
                                >
                                    {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="submit" className={styles.btnPrimary} disabled={saving}>
                        {saving ? 'Saving…' : 'Update Password'}
                    </button>
                </form>
            )}
        </SectionCard>
    );
}

export default SecuritySection;
