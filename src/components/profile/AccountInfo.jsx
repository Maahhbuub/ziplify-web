import { useState } from 'react';
import { Mail, Check, ChevronRight } from 'lucide-react';
import { User } from 'lucide-react';
import { SectionCard, FieldRow, Divider } from './SectionCard';
import api from '../../api/api';
import toast from 'react-hot-toast';
import styles from './AccountInfo.module.css';

function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function EditNameField({ user, setUser }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name ?? '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed)
            return toast.error("Name can't be empty");
        
        if (trimmed === user.name) {
            setEditing(false);
            return;
        }

        setSaving(true);
        try {
            const res = await api.patch('/user/profile', { name: trimmed });
            setUser(prev => ({ ...prev, name: res.data.user?.name ?? trimmed }));
            toast.success('Name updated!');
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update name');
        } finally {
            setSaving(false);
        }
    };

    if (editing) {
        return (
            <div className={styles.editRow}>
                <div className={styles.inlineEdit}>
                    <input
                        className={styles.inlineInput}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') setEditing(false);
                        }}
                        autoFocus
                        maxLength={60}
                    />
                </div>
                <div className={styles.editActions}>
                    <button className={styles.btnSm} onClick={handleSave} disabled={saving}>
                        {saving ? <span className={styles.spinner} /> : <><Check size={13} /> Save</>}
                    </button>
                    <button
                        className={`${styles.btnSm} ${styles.btnGhost}`}
                        onClick={() => { setEditing(false); setName(user?.name ?? ''); }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FieldRow
            label="Full Name"
            value={user?.name || '—'}
            action={
                <button className={styles.editLink} onClick={() => setEditing(true)}>
                    Edit <ChevronRight size={13} />
                </button>
            }
        />
    );
}

function AccountInfo({ user, setUser }) {
    return (
        <SectionCard icon={User} title="Account Information">
            <Divider />
            <EditNameField user={user} setUser={setUser} />
            <Divider />
            <FieldRow
                label="Email Address"
                value={user?.email || '—'}
                action={<span className={styles.badge}><Mail size={11} /> Primary</span>}
            />
            <Divider />
            <FieldRow
                label="Member Since"
                value={formatDate(user?.createdAt)}
            />
        </SectionCard>
    );
}

export default AccountInfo;
